export const WORKSPACE_COLOR = {
  BLUE: "#3B82F6",
  PURPLE: "#8B5CF6",
  GREEN: "#22C55E",
  ORANGE: "#F97316",
  RED: "#EF4444",
  YELLOW: "#EAB308",
  PINK: "#EC4899",
  CYAN: "#06B6D4",
} as const;

export type WorkspaceColor =
  (typeof WORKSPACE_COLOR)[keyof typeof WORKSPACE_COLOR];

export const WORKSPACE_ICON = {
  BOOK: "book",
  GRADUATION_CAP: "graduation-cap",
  NOTEBOOK: "notebook",
  FILE_TEXT: "file-text",
  BRAIN: "brain",
  CODE: "code",
  FLASK: "flask",
  GLOBE: "globe",
} as const;

export type WorkspaceIcon =
  (typeof WORKSPACE_ICON)[keyof typeof WORKSPACE_ICON];