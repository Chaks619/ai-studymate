// Application Routes
export const APP_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  
  // Dashboard
  DASHBOARD: '/dashboard',
  
  // Feature Routes
  CHAT: '/chat',
  QUIZ: '/quiz',
  FLASHCARDS: '/flashcards',
  ROADMAP: '/roadmap',
  PDF: '/pdf',
  
  // Public Pages
  PRICING: '/pricing',
  ABOUT: '/about',
  CONTACT: '/contact',
  
  // Error Pages
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/401',
  FORBIDDEN: '/403',
} as const;
