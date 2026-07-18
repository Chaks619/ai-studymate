import { cn } from "@/lib/utils";
import { formatRelativeDate } from "@/lib/format";
import type { ConversationSummary } from "@/types/api/conversation.types";

interface Props {
  conversation: ConversationSummary;
  isActive: boolean;
  onClick: () => void;
}

/**
 * One row in the conversation list: title over a relative timestamp. The whole
 * card is the click target that opens the conversation. Sprint 5 wires it into
 * ConversationList; Phase 3 adds hover actions such as delete.
 */
export function ConversationCard({
  conversation,
  isActive,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-lg px-3 py-2 text-left transition-colors",
        isActive ? "bg-muted" : "hover:bg-muted/60"
      )}
    >
      <p className="truncate text-sm font-medium">
        {conversation.title}
      </p>

      <p className="text-xs text-muted-foreground">
        {formatRelativeDate(conversation.updatedAt)}
      </p>
    </button>
  );
}
