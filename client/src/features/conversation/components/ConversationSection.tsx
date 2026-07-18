import { useState } from "react";
import { MessagesSquare } from "lucide-react";

import { StudyPanel } from "@/components/common/StudyPanel";

import { ConversationList } from "./ConversationList";
import { ConversationWindow } from "./ConversationWindow";

interface Props {
  documentId: string;
}

/**
 * Entry point for the chat tab. Owns the single piece of shared state — which
 * conversation is open — and hands it to the list (to highlight) and the
 * window (to render). `null` means no conversation is open yet: the New Chat
 * empty state.
 *
 * A New Chat is not persisted here; selecting it only clears the id. The
 * conversation is created when the first message is sent (Sprint 9), at which
 * point the window reports the new id back through onConversationCreated.
 */
export function ConversationSection({ documentId }: Props) {
  const [selectedConversationId, setSelectedConversationId] =
    useState<string | null>(null);

  return (
    <StudyPanel
      icon={MessagesSquare}
      title="Chat with document"
      description="Ask questions and get grounded answers"
      contentClassName="p-0"
    >
      <div className="grid h-128 grid-rows-[auto_1fr] md:grid-cols-[minmax(0,260px)_1fr] md:grid-rows-1">
        <div className="overflow-y-auto border-b border-border/60 p-3 md:border-r md:border-b-0">
          <ConversationList
            documentId={documentId}
            selectedConversationId={selectedConversationId}
            onSelect={setSelectedConversationId}
            onNewChat={() => setSelectedConversationId(null)}
          />
        </div>

        <div className="min-h-0 p-4 sm:p-5">
          <ConversationWindow
            documentId={documentId}
            conversationId={selectedConversationId}
            onConversationCreated={setSelectedConversationId}
          />
        </div>
      </div>
    </StudyPanel>
  );
}
