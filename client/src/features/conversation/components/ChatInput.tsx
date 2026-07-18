import type { KeyboardEvent } from "react";
import { ArrowUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

/**
 * The composer. Controlled — the draft lives in the parent so a suggested
 * prompt can fill it. Enter sends; Shift+Enter inserts a newline. The textarea
 * grows with its content (field-sizing) up to a cap, then scrolls.
 */
export function ChatInput({
  value,
  onChange,
  onSend,
  disabled,
}: Props) {
  const canSend = value.trim().length > 0 && !disabled;

  function handleKeyDown(
    event: KeyboardEvent<HTMLTextAreaElement>
  ) {
    // While an IME composition is active (e.g. CJK input) Enter commits the
    // character — it must not send the message.
    if (event.nativeEvent.isComposing) {
      return;
    }

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      if (canSend) {
        onSend();
      }
    }
  }

  return (
    <div className="flex items-end gap-2">
      <Textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message…"
        rows={1}
        disabled={disabled}
        className="max-h-40 min-h-10 resize-none"
      />

      <Button
        type="button"
        size="icon"
        onClick={onSend}
        disabled={!canSend}
        aria-label="Send message"
      >
        <ArrowUp />
      </Button>
    </div>
  );
}
