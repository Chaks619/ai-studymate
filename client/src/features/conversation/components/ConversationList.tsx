import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetDocumentConversationsQuery } from "@/services/api/conversation.api";

import { ConversationCard } from "./ConversationCard";

interface Props {
  documentId: string;
  selectedConversationId: string | null;
  onSelect: (conversationId: string) => void;
  onNewChat: () => void;
}

/**
 * The left rail: a New Chat button above the list of past conversations.
 *
 * New Chat does NOT create anything — it only clears the selection so the
 * window shows the empty state. A conversation is created lazily, on the first
 * message (Sprint 9), which keeps empty conversations out of the database.
 */
export function ConversationList({
  documentId,
  selectedConversationId,
  onSelect,
  onNewChat,
}: Props) {
  const { data: conversations, isLoading } =
    useGetDocumentConversationsQuery(documentId);

  return (
    <aside className="flex flex-col gap-2">
      <Button
        variant="outline"
        className="justify-start"
        onClick={onNewChat}
      >
        <Plus />
        New Chat
      </Button>

      {isLoading ? (
        <div className="flex flex-col gap-1">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-11 w-full rounded-lg"
            />
          ))}
        </div>
      ) : conversations && conversations.length > 0 ? (
        <div className="flex flex-col gap-1">
          {conversations.map((conversation) => (
            <ConversationCard
              key={conversation.id}
              conversation={conversation}
              isActive={
                conversation.id === selectedConversationId
              }
              onClick={() => onSelect(conversation.id)}
            />
          ))}
        </div>
      ) : (
        <p className="px-3 py-2 text-xs text-muted-foreground">
          No conversations yet.
        </p>
      )}
    </aside>
  );
}
