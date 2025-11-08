// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { testConnection } = require('./models');

// Import routes
const authRoutes = require('./routes/auth');
const lessonRoutes = require('./routes/lessons');
const sectionRoutes = require('./routes/sections'); // 👈 will be added in Day 4
const progressRoutes = require('./routes/progress');
const quizRoutes = require('./routes/quizzes');

const app = express();

// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);

// Mount routes
app.use('/api/auth', authRoutes);     // user auth routes
app.use('/api/lessons', lessonRoutes); // lessons routes
app.use('/api', sectionRoutes);        // lesson section routes (optional for Day 4)
app.use('/api', progressRoutes);
app.use('/api/quizzes', quizRoutes);

// Health check route
app.get('/api/health', (req, res) =>
  res.json({ ok: true, env: process.env.NODE_ENV || 'development' })
);

const PORT = process.env.PORT || 4000;
let server = null;

// Start the server
async function start() {
  try {
    await testConnection(); // test database connection
    server = app.listen(PORT, () =>
      console.log(`🚀 Server listening on http://localhost:${PORT} (PORT=${PORT})`)
    );

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

module.exports = app; // useful for testing or external tools
