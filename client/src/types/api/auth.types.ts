export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;

  avatar: {
    url: string;
    publicId: string;
  };

  role: string;

  subscription: string;

  isVerified: boolean;

  createdAt: string;

  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;

  message: string;

  data: {
    user: User;
    accessToken: string;
  };
}