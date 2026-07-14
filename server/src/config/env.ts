import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(5000),
  CLIENT_URL: z.string().url(),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string(),
  JWT_REFRESH_EXPIRES_IN: z.string(),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
  GEMINI_API_KEY: z.string().min(1),
  GEMINI_MODEL: z.string().default('gemini-3.5-flash'),
});

const parsedEnv = envSchema.parse(process.env);

export const env = {
  NODE_ENV: parsedEnv.NODE_ENV,
  PORT: parsedEnv.PORT,
  CLIENT_URL: parsedEnv.CLIENT_URL,
  MONGODB_URI: parsedEnv.MONGODB_URI,
  JWT_ACCESS_SECRET: parsedEnv.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: parsedEnv.JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRES_IN: parsedEnv.JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN: parsedEnv.JWT_REFRESH_EXPIRES_IN,
  CLOUDINARY_CLOUD_NAME: parsedEnv.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: parsedEnv.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: parsedEnv.CLOUDINARY_API_SECRET,
  GEMINI_API_KEY: parsedEnv.GEMINI_API_KEY,
  GEMINI_MODEL: parsedEnv.GEMINI_MODEL,
};
