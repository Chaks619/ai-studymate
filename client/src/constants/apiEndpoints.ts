// API Endpoints
export const API_ENDPOINTS = {
  AUTH: '/auth',
  CHAT: '/chat',
  QUIZ: '/quiz',
  FLASHCARDS: '/flashcards',
  ROADMAP: '/roadmap',
  PDF: '/pdf',
  DASHBOARD: '/dashboard',
  USER: '/user',
} as const;

// API Base URL
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
