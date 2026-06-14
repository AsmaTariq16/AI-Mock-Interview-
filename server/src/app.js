import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDb } from './models/db.js';
import authRoutes from './routes/auth.routes.js';
import interviewRoutes from './routes/interview.routes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Global Middleware
app.use(cors({
  origin: '*', // Allow all origins for dev simplicity, can narrow to client dev server (e.g. http://localhost:5173) in production
  credentials: true
}));
app.use(express.json());

// Base Route log
app.use((req, res, next) => {
  console.log(`[API Request] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/interview', interviewRoutes);

// Server status endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Mocking AI Backend Service is running' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Error Middleware]:', err.stack);
  res.status(500).json({
    success: false,
    message: 'An internal server error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

async function startServer() {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`🚀 API Server running on port: http://localhost:${PORT}`);
      console.log(`🛡️  JWT Authentication ready.`);
      console.log(`======================================================\n`);
    });
  } catch (error) {
    console.error('Critical: Server failed to start:', error);
    process.exit(1);
  }
}

startServer();
export default app;
