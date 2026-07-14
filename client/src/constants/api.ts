export const API_ENDPOINTS = {
  AUTH: '/auth',
  CHAT: '/chat',
  QUIZ: '/quiz',
  FLASHCARDS: '/flashcards',
  ROADMAP: '/roadmap',
  PDF: '/pdf',
  DASHBOARD: '/dashboard',
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
