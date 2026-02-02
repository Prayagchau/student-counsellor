import createApp from './app';
import connectDatabase from './config/database';

/**
 * Server Entry Point
 * Connects to database and starts Express server
 */
const startServer = async (): Promise<void> => {
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
║   Environment: ${process.env.NODE_ENV?.padEnd(35) || 'development'.padEnd(35)}║
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
