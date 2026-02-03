const createApp = require('./app');
const connectDatabase = require('./config/database');

/**
 * Server Entry Point
 */
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Create Express app
    const app = createApp();

    // Get port from environment
    const PORT = process.env.PORT || 5000;

    // Start server
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════╗
║                                                    ║
║   🚀 EduGuide Backend Server                       ║
║                                                    ║
║   Environment: ${(process.env.NODE_ENV || 'development').padEnd(35)}║
║   Port: ${String(PORT).padEnd(42)}║
║   API: http://localhost:${PORT}/api${' '.repeat(21)}║
║                                                    ║
╚════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
