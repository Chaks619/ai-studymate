// React Query Keys for better cache management
export const QUERY_KEYS = {
  AUTH: {
    ALL: ['auth'] as const,
    ME: ['auth', 'me'] as const,
    LOGIN: ['auth', 'login'] as const,
  },
  
  PDF: {
    ALL: ['pdf'] as const,
    LISTS: () => [...QUERY_KEYS.PDF.ALL, 'list'] as const,
    LIST: (filters: any) => [...QUERY_KEYS.PDF.LISTS(), filters] as const,
    DETAILS: () => [...QUERY_KEYS.PDF.ALL, 'detail'] as const,
    DETAIL: (id: string) => [...QUERY_KEYS.PDF.DETAILS(), id] as const,
  },
  
  QUIZ: {
    ALL: ['quiz'] as const,
    LISTS: () => [...QUERY_KEYS.QUIZ.ALL, 'list'] as const,
    DETAILS: () => [...QUERY_KEYS.QUIZ.ALL, 'detail'] as const,
    DETAIL: (id: string) => [...QUERY_KEYS.QUIZ.DETAILS(), id] as const,
  },
  
  FLASHCARDS: {
    ALL: ['flashcards'] as const,
    LISTS: () => [...QUERY_KEYS.FLASHCARDS.ALL, 'list'] as const,
    DETAILS: () => [...QUERY_KEYS.FLASHCARDS.ALL, 'detail'] as const,
    DETAIL: (id: string) => [...QUERY_KEYS.FLASHCARDS.DETAILS(), id] as const,
  },
  
  ROADMAP: {
    ALL: ['roadmap'] as const,
    LISTS: () => [...QUERY_KEYS.ROADMAP.ALL, 'list'] as const,
    DETAILS: () => [...QUERY_KEYS.ROADMAP.ALL, 'detail'] as const,
    DETAIL: (id: string) => [...QUERY_KEYS.ROADMAP.DETAILS(), id] as const,
  },
  
  CHAT: {
    ALL: ['chat'] as const,
    LISTS: () => [...QUERY_KEYS.CHAT.ALL, 'list'] as const,
    MESSAGES: ['chat', 'messages'] as const,
  },
} as const;
