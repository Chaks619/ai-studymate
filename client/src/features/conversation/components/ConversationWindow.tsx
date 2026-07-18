import { useEffect, useRef, useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppDispatch } from "@/app/hooks";
import {
  conversationApi,
  useCreateConversationMutation,
  useGetConversationQuery,
  useRegenerateMessageMutation,
  useSendMessageMutation,
} from "@/services/api/conversation.api";
import type { Message } from "@/types/api/conversation.types";

import { ChatInput } from "./ChatInput";
import { EmptyConversation } from "./EmptyConversation";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";

interface Props {
  documentId: string;
  conversationId: string | null;
  onConversationCreated: (conversationId: string) => void;
}

/**
 * The right pane: a scrolling message area above a persistent composer.
 *
 * Sending from the empty state creates the conversation (Sprint 9); sending
 * within an open one appends a message (Sprint 10). Regenerate replaces the
 * last answer. Both echo optimistically and show a typing indicator; the
 * mutation's cache invalidation then refetches the canonical thread. The view
 * auto-scrolls to the newest message.
 */
export function ConversationWindow({
  documentId,
  conversationId,
  onConversationCreated,
}: Props) {
  const [draft, setDraft] = useState("");
  const dispatch = useAppDispatch();
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError } =
    useGetConversationQuery(conversationId ?? skipToken);

  const [createConversation, { isLoading: isCreating }] =
    useCreateConversationMutation();
  const [sendMessage, { isLoading: isSending }] =
    useSendMessageMutation();
  const [regenerateMessage, { isLoading: isRegenerating }] =
    useRegenerateMessageMutation();

  const isGenerating = isSending || isRegenerating;

  // Keep the newest message (or the typing indicator) in view.
  useEffect(() => {
    const el = scrollRef.current;

    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [conversationId, data?.messages.length, isGenerating]);

  async function handleSend() {
    const message = draft.trim();

    if (!message || isCreating || isGenerating) {
      return;
    }

    // --- First message: create the conversation ---
    if (!conversationId) {
      try {
        const conversation = await createConversation({
          documentId,
          body: { message },
        }).unwrap();

        dispatch(
          conversationApi.util.upsertQueryData(
            "getConversation",
            conversation.id,
            conversation
          )
        );

        setDraft("");
        onConversationCreated(conversation.id);
      } catch {
        toast.error(
          "Couldn't start the conversation. Please try again."
        );
      }

      return;
    }

    // --- Follow-up: append to the open conversation ---
    const now = new Date().toISOString();
    const optimisticUser: Message = {
      id: `temp-${Date.now()}`,
      conversation: conversationId,
      role: "user",
      content: message,
      createdAt: now,
      updatedAt: now,
    };

    const patch = dispatch(
      conversationApi.util.updateQueryData(
        "getConversation",
        conversationId,
        (cached) => {
          cached.messages.push(optimisticUser);
        }
      )
    );

    setDraft("");

    try {
      await sendMessage({
        conversationId,
        body: { message },
      }).unwrap();
    } catch {
      patch.undo();
      setDraft(message);
      toast.error(
        "Couldn't send your message. Please try again."
      );
    }
  }

  async function handleRegenerate() {
    if (!conversationId || isCreating || isGenerating) {
      return;
    }

    // Drop the last answer so the typing indicator takes its place.
    const patch = dispatch(
      conversationApi.util.updateQueryData(
        "getConversation",
        conversationId,
        (cached) => {
          const last =
            cached.messages[cached.messages.length - 1];

          if (last?.role === "assistant") {
            cached.messages.pop();
          }
        }
      )
    );

    try {
      await regenerateMessage(conversationId).unwrap();
    } catch {
      patch.undo();
      toast.error(
        "Couldn't regenerate the answer. Please try again."
      );
    }
  }

  const lastMessage = data?.messages.at(-1);
  const canRegenerate =
    !!conversationId &&
    lastMessage?.role === "assistant" &&
    !isCreating &&
    !isGenerating;

  return (
    <div className="flex h-full flex-col gap-3">
      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto"
      >
        {!conversationId ? (
          <EmptyConversation onSelectPrompt={setDraft} />
        ) : isLoading ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-10 w-2/3 self-start rounded-2xl" />
            <Skeleton className="h-10 w-1/2 self-end rounded-2xl" />
            <Skeleton className="h-16 w-3/4 self-start rounded-2xl" />
          </div>
        ) : isError || !data ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Couldn't load this conversation.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {data.messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
              />
            ))}

            {isGenerating && <TypingIndicator />}

            {canRegenerate && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1.5 self-start px-2 text-xs text-muted-foreground"
                onClick={handleRegenerate}
              >
                <RefreshCw className="size-3.5" />
                Regenerate
              </Button>
            )}
          </div>
        )}
      </div>

      <ChatInput
        value={draft}
        onChange={setDraft}
        onSend={handleSend}
        disabled={isCreating || isGenerating}
      />
    </div>
  );
}
