interface Props {
  onSelectPrompt: (prompt: string) => void;
}

/**
 * The New Chat landing shown in the message area when no conversation is open.
 * The chips are shortcuts: clicking one drops its text into the composer (the
 * parent owns the draft) rather than sending immediately, so the user can edit
 * before sending.
 */
const SUGGESTED_PROMPTS = [
  "Explain this document",
  "Summarize the key points",
  "Generate interview questions",
  "Create revision notes",
  "Explain it like I'm five",
];

export function EmptyConversation({ onSelectPrompt }: Props) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 px-4 text-center">
      <div>
        <h2 className="text-lg font-semibold">
          How can I help you today?
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Ask anything about this document.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onSelectPrompt(prompt)}
            className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
