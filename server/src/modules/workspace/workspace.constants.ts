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