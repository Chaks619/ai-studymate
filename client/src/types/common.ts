export interface AppUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

export interface AppError {
  code: string;
  message: string;
  details?: Record<string, any>;
}
