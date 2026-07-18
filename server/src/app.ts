import cors from 'cors';
import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { ZodError } from 'zod';
import { env } from './config/env.js';
import { ApiError, ERROR_CODES, HTTP_STATUS } from './shared/errors/index.js';
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import workspaceRoutes from "./modules/workspace/workspace.routes.js";
import documentRoutes from "./modules/document/document.routes.js"
import summaryRoutes from "./modules/summary/summary.routes.js";
import flashcardRoutes from "@/modules/flashcards/flashcard.routes.js";
import quizRoutes from "@/modules/quiz/quiz.routes.js";
import {
  conversationRoutes,
  documentConversationRoutes,
} from "@/modules/conversation/conversation.routes.js";

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


app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/documents", documentRoutes);
app.use('/api/documents', summaryRoutes);
app.use("/api/documents", flashcardRoutes);
app.use("/api/documents", quizRoutes);
app.use("/api/documents", documentConversationRoutes);
app.use("/api/conversations", conversationRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});
// All four parameters are required — Express identifies an error handler by
// its arity, so `next` cannot be dropped even though it is unused.
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  // Validation failures are the caller's fault, not ours — without this they
  // surface as a 500 and read like the server fell over.
  if (err instanceof ZodError) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      code: ERROR_CODES.VALIDATION_FAILED,
      message: err.issues[0]?.message ?? 'Invalid request',
      errors: err.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    });

    return;
  }

  // Deliberate, client-facing failures. The message was written to be read by
  // the caller, so it is safe to send verbatim in any environment.
  if (err instanceof ApiError) {
    res.status(err.status).json({
      success: false,
      code: err.code,
      message: err.message,
    });

    return;
  }

  // Anything else is a bug. Log it in full, but never echo the message — it
  // can carry a stack, a driver error, or a connection string.
  console.error('Unhandled error:', err);

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    code: ERROR_CODES.INTERNAL_ERROR,
    message: 'Internal Server Error',
    error: env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

export default app;
