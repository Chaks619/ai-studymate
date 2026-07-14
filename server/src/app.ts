import cors from 'cors';
import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import authRoutes from "./modules/auth/auth.routes.js";
import workspaceRoutes from "./modules/workspace/workspace.routes.js";
import documentRoutes from "./modules/document/document.routes.js"
import summaryRoutes from "./modules/summary/summary.routes.js";
import flashcardRoutes from "@/modules/flashcards/flashcard.routes.js";
import quizRoutes from "@/modules/quiz/quiz.routes.js";

const app: Express = express();

// Security middleware
app.use(helmet());

// Compression middleware
app.use(compression());

// CORS middleware
app.use(
  cors({
    origin: process.env['CLIENT_URL'] || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Request logging
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Cookie parsing middleware
app.use(cookieParser());


app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});


app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/documents", documentRoutes);
app.use('/api/documents', summaryRoutes);
app.use("/api/documents", flashcardRoutes);
app.use("/api/documents", quizRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});
interface CustomError extends Error {
  status?: number;
  code?: string;
}

app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    message,
    error: process.env['NODE_ENV'] === 'development' ? err : undefined,
  });
});

export default app;
