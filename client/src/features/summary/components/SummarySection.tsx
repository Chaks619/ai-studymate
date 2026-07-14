import { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Clock, Copy, RefreshCw, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  StudyPanel,
  StudyPanelEmpty,
  StudyPanelError,
  StudyPanelSkeleton,
} from "@/components/common/StudyPanel";
import {
  useGenerateSummaryMutation,
  useGetSummaryQuery,
} from "@/services/api/summary.api";
import { pluralize, readingTimeMinutes } from "@/lib/format";

interface Props {
  documentId: string;
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
      onClick={handleCopy}
      aria-label="Copy summary"
    >
      {copied ? <Check className="text-success" /> : <Copy />}
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}

export function SummarySection({ documentId }: Props) {
  const { data: summary, isLoading, isError } = useGetSummaryQuery(documentId);

  const [generateSummary, { isLoading: isGenerating }] =
    useGenerateSummaryMutation();

  async function handleGenerate() {
    try {
      await generateSummary(documentId).unwrap();

      toast.success("Summary ready");
    } catch {
      toast.error("Couldn't generate the summary. Please try again.");
    }
  }

  if (isLoading) {
    return <StudyPanelSkeleton lines={6} />;
  }

  // A missing summary is the normal state for a fresh document, not an error.
  if (isError || !summary) {
    return (
      <StudyPanel
        icon={Sparkles}
        title="Summary"
        description="Key points distilled from your document"
      >
        <StudyPanelEmpty
          icon={Sparkles}
          title="No summary yet"
          description="Generate a concise, structured overview of this document so you can grasp the essentials in a couple of minutes."
          action={
            <Button size="lg" disabled={isGenerating} onClick={handleGenerate}>
              {isGenerating ? (
                <>
                  <RefreshCw className="animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <Sparkles />
                  Generate summary
                </>
              )}
            </Button>
          }
        />
      </StudyPanel>
    );
  }

  const content = summary.content ?? "";
  const minutes = readingTimeMinutes(content);

  return (
    <StudyPanel
      icon={Sparkles}
      title="Summary"
      description={
        <span className="inline-flex items-center gap-1.5">
          <Clock className="size-3 opacity-70" />
          {pluralize(minutes, "min")} read
        </span>
      }
      actions={
        <>
          <CopyButton content={content} />

          <Button
            variant="outline"
            size="sm"
            disabled={isGenerating}
            onClick={handleGenerate}
          >
            <RefreshCw className={isGenerating ? "animate-spin" : undefined} />
            {isGenerating ? "Regenerating…" : "Regenerate"}
          </Button>
        </>
      }
      contentClassName="p-0"
    >
      {/* Dim rather than unmount while regenerating, so the page doesn't jump. */}
      <div
        className={
          isGenerating
            ? "pointer-events-none p-5 opacity-50 transition-opacity sm:p-6"
            : "p-5 transition-opacity sm:p-6"
        }
      >
        {content.trim() ? (
          <div className="markdown">
            <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
          </div>
        ) : (
          <StudyPanelError
            title="This summary came back empty"
            description="The model didn't return any content. Regenerating usually fixes it."
            action={
              <Button size="lg" onClick={handleGenerate} disabled={isGenerating}>
                <RefreshCw className={isGenerating ? "animate-spin" : undefined} />
                Try again
              </Button>
            }
          />
        )}
      </div>
    </StudyPanel>
  );
}
