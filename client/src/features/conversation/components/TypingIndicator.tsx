/**
 * The assistant's "thinking" state — three dots that bounce in sequence,
 * styled to match an assistant message bubble so it reads as a reply forming.
 */
export function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1.5 rounded-2xl bg-muted px-4 py-4">
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className="size-2 animate-bounce rounded-full bg-foreground/30"
            style={{
              animationDelay: `${index * 160}ms`,
              animationDuration: "1s",
            }}
          />
        ))}
      </div>
    </div>
  );
}
