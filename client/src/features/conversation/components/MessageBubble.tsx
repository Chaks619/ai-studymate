import { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Message } from "@/types/api/conversation.types";

interface Props {
  message: Message;
}

function CopyButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(content);

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy to clipboard");
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-7 gap-1.5 px-2 text-xs text-muted-foreground"
      onClick={handleCopy}
      aria-label="Copy message"
    >
      {copied ? (
        <Check className="size-3.5 text-success" />
      ) : (
        <Copy className="size-3.5" />
      )}
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}

/**
 * A single message. The user's text is a plain right-aligned bubble; the
 * assistant's is rendered as markdown (lists, code, tables) left-aligned, with
 * a copy action beneath it.
 */
export function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div
          className={cn(
            "max-w-[80%] rounded-2xl bg-primary px-4 py-2",
            "text-sm whitespace-pre-wrap text-primary-foreground"
          )}
        >
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-0.5">
      <div className="max-w-[88%] rounded-2xl bg-muted px-4 py-3">
        <div className="markdown">
          <Markdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </Markdown>
        </div>
      </div>

      <CopyButton content={message.content} />
    </div>
  );
}
