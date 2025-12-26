// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server: IOServer } = require('socket.io');
const module2Routes = require('./routes/module2');
const classroomRoutes = safeRequire('./routes/classroom');
const { ChatMessage, ClassParticipant, User } = require('./models');
const { testConnection } = require('./models');

const app = express();

// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001', 
      'http://localhost:5173',
      process.env.FRONTEND_ORIGIN
    ].filter(Boolean),
    credentials: true,
  })
);

// === Safe route imports (optional routes won't crash startup) ===
function safeRequire(path) {
  try {
    return require(path);
  } catch (err) {
    console.warn(`⚠️  Optional module not found: ${path}`);
    return null;
  }
}

const authRoutes = safeRequire('./routes/auth');
const lessonRoutes = safeRequire('./routes/lessons');
const sectionRoutes = safeRequire('./routes/sections');
const progressRoutes = safeRequire('./routes/progress');
const quizRoutes = safeRequire('./routes/quizzes');
const dashboardRoutes = safeRequire('./routes/dashboard');
const attendanceRoutes = safeRequire('./routes/attendance');
const usersRoutes = safeRequire('./routes/users');
const grammarRoutes = safeRequire('./routes/grammar');

// === DEV HELPER: simple request logger (temporary; only in non-production) ===
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log('➡️ Incoming', req.method, req.path);
    next();
  });
}

// === Mount routes (only if present) ===
if (authRoutes) app.use('/api/auth', authRoutes);
if (module2Routes) app.use('/api/module2', module2Routes);
if (lessonRoutes) app.use('/api/lessons', lessonRoutes);
if (sectionRoutes) app.use('/api', sectionRoutes);    // sections may use /api prefix
if (progressRoutes) app.use('/api', progressRoutes);  // progress routes under /api
if (quizRoutes) app.use('/api/quizzes', quizRoutes);
if (dashboardRoutes) app.use('/api/dashboard', dashboardRoutes);
if (attendanceRoutes) app.use('/api/attendance', attendanceRoutes);
if (usersRoutes) app.use('/api/users', usersRoutes);
if (grammarRoutes) app.use('/api/grammar', grammarRoutes);
if (classroomRoutes) app.use('/api/classroom', classroomRoutes);

// Health check route
app.get('/api/health', (req, res) =>
  res.json({ ok: true, env: process.env.NODE_ENV || 'development' })
);

// Add a ping route for quick connectivity tests
app.get('/api/ping', (req, res) => res.json({ ok: true, message: 'pong' }));

// === DEV HELPER: robust route lister ===
function listRoutes() {
  try {
    console.log('Registered routes:');
    const stack = app._router && app._router.stack ? app._router.stack : [];
    stack.forEach((layer) => {
      // Directly registered routes on app
      if (layer.route && layer.route.path) {
        const methods = Object.keys(layer.route.methods || {}).join(',').toUpperCase();
        console.log(methods, layer.route.path);
        return;
      }

      // Router mounted as middleware
      if (layer.name === 'router' && layer.handle && Array.isArray(layer.handle.stack)) {
        // Try to extract mount path (best-effort)
        let mountPath = '';
        try {
          if (layer.regexp && layer.regexp.source) {
            const m = layer.regexp.source
              .replace('\\/?', '')
              .replace('(?=\\/|$)', '')
              .replace('^', '')
              .replace('$', '');
            mountPath = m === '' ? '' : m;
          }
        } catch (e) {
          mountPath = '';
        }

        layer.handle.stack.forEach((handler) => {
          if (handler.route && handler.route.path) {
            const methods = Object.keys(handler.route.methods || {}).join(',').toUpperCase();
            const displayPath = mountPath ? `${mountPath}${handler.route.path}` : handler.route.path;
            console.log(methods, displayPath);
          }
        });
      }
    });
  } catch (err) {
    console.error('Failed to list routes', err);
  }
}

// BIND HOST to 0.0.0.0 for reliable local access (can be overridden with HOST env var)
const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 4000;
let server = null;

// Start the server
async function start() {
  try {
    await testConnection(); // test database connection
      // Use an HTTP server so we can attach Socket.IO
      server = http.createServer(app);

      // Attach Socket.IO
      const io = new IOServer(server, {
        cors: {
          origin: [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:5173',
            process.env.FRONTEND_ORIGIN
          ].filter(Boolean),
          methods: ['GET','POST'] ,
          credentials: true,
        }
      });

      // Basic class chat namespace/handlers
      io.on('connection', socket => {
        // join a class room
        socket.on('joinClass', async ({ classId, user, sessionToken } = {}) => {
          try {
            const room = `class:${classId || 'global'}`;
            socket.join(room);
            socket._classRoom = room;
            socket._user = user || { id: null, name: 'Anonymous' };
            socket._sessionToken = sessionToken || null;
            // notify room that a user joined
            socket.to(room).emit('systemMessage', { text: `${socket._user.name} joined the class.` });

            // Build active participant list from connected sockets in the room (include socketId)
            try{
              const clients = io.sockets.adapter.rooms.get(room) || new Set();
              const out = [];
              for(const sid of clients){
                const s = io.sockets.sockets.get(sid);
                if(!s) continue;
                out.push({ socketId: sid, userId: s._user?.id || null, name: s._user?.name || (s._user && s._user.email) || 'Unknown', role: s._user?.role || null });
              }
              io.to(room).emit('participants', out);
            }catch(e){ console.error('participant broadcast error', e) }
          } catch (e) { console.error('joinClass error', e) }
        });

        // WebRTC signaling helpers: forward offers/answers/ICE to target sockets
        socket.on('webrtc-offer', (payload) => {
          try{
            // payload: { to: targetSocketId, sdp }
            if(payload && payload.to){
              io.to(payload.to).emit('webrtc-offer', { from: socket.id, sdp: payload.sdp });
            } else {
              // broadcast to room except sender
              const room = socket._classRoom;
              socket.to(room).emit('webrtc-offer', { from: socket.id, sdp: payload.sdp });
            }
          }catch(e){ console.error('webrtc-offer forward error', e) }
        });

        socket.on('webrtc-answer', (payload) => {
          try{
            // payload: { to: targetSocketId, sdp }
            if(payload && payload.to){
              io.to(payload.to).emit('webrtc-answer', { from: socket.id, sdp: payload.sdp });
            }
          }catch(e){ console.error('webrtc-answer forward error', e) }
        });

        socket.on('webrtc-ice', (payload) => {
          try{
            // payload: { to: targetSocketId, candidate }
            if(payload && payload.to){
              io.to(payload.to).emit('webrtc-ice', { from: socket.id, candidate: payload.candidate });
            }
          }catch(e){ console.error('webrtc-ice forward error', e) }
        });

        // chat message - persist to DB then broadcast
        socket.on('chatMessage', async (payload) => {
          try{
            // payload: { classId, sessionToken, text }
            const room = socket._classRoom || `class:${payload?.classId || 'global'}`;
            const text = payload?.text || payload;
            const classId = payload?.classId || (room && room.split(':')[1]) || null;
            const sessionToken = payload?.sessionToken || socket._sessionToken || null;
            // persist
            try{
              await ChatMessage.create({ class_id: classId, session_token: sessionToken, user_id: socket._user?.id || null, user_name: socket._user?.name || null, text });
            }catch(saveErr){ console.error('Failed to save chat message', saveErr) }
            const out = { id: Date.now(), from: socket._user?.name || 'Anonymous', text, ts: new Date().toISOString(), classId, sessionToken };
            io.to(room).emit('chatMessage', out);
          }catch(e){ console.error('chatMessage error', e) }
        });

        socket.on('disconnect', async () => {
          try{
            const room = socket._classRoom;
            if(room && socket._user) socket.to(room).emit('systemMessage', { text: `${socket._user.name} left the class.` });
            // refresh participants listing for room (best-effort)
            try{
              if(room && socket._sessionToken){
                const parts = await ClassParticipant.findAll({ where: { session_token: socket._sessionToken }, include: [{ model: User, attributes: ['id','name'] }] });
                const out = parts.map(r => ({ id: r.user_id || r.id, name: (r.User && r.User.name) || r.user_name || null, role: r.role }));
                io.to(room).emit('participants', out);
              }
            }catch(e){/* ignore participant refresh errors */}
          }catch(e){/* ignore */}
        });
      });

      server.listen(PORT, HOST, () => {
        console.log(`🚀 Server listening on http://${HOST}:${PORT} (PORT=${PORT})`);
      // show registered routes once server is up (dev only)
      if (process.env.NODE_ENV !== 'production') listRoutes();
    });

    // Graceful shutdown
    const shutdown = (signal) => {
      console.log(`\nReceived ${signal}. Shutting down...`);
      if (server) {
        server.close(() => {
          console.log('HTTP server closed.');
          process.exit(0);
        });
      }
      // Force exit after timeout
      setTimeout(() => process.exit(1), 5000);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('uncaughtException', (err) => {
      console.error('Uncaught exception:', err);
      shutdown('uncaughtException');
    });
    process.on('unhandledRejection', (reason) => {
      console.error('Unhandled rejection:', reason);
    });
  } catch (err) {
    console.error('❌ Failed to start server — DB connection error:', err);
    process.exit(1);
  }
}

start();

module.exports = app;
