// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const module2Routes = require('./routes/module2');
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
if (grammarRoutes) app.use('/api/grammar', grammarRoutes);

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
    server = app.listen(PORT, HOST, () => {
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
