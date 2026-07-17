import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDb } from './models/db.js';
import authRoutes from './routes/auth.routes.js';
import interviewRoutes from './routes/interview.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/**
 * Allowed Frontend Origins
 */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://ai-mock-interview-snowy-six.vercel.app",
  "https://ai-mock-interview-git-main-asmas-projects-d51a5648.vercel.app"
];

/**
 * CORS Configuration
 */
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests like Postman or server-to-server
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("Blocked by CORS:", origin);

    return callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },

  credentials: true,

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS"
  ],

  allowedHeaders: [
    "Origin",
    "Content-Type",
    "Accept",
    "Authorization"
  ]
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Request Logger
 */
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

/**
 * Routes
 */
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/interview', interviewRoutes);

/**
 * Health Check
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend is running successfully'
  });
});

/**
 * 404 Handler
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

/**
 * Global Error Handler
 */
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

/**
 * Start Server
 */
async function startServer() {
  try {
    await connectDb();

    app.listen(PORT, () => {
      console.log("====================================");
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
      console.log("====================================");
    });

  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
}

startServer();

export default app;
