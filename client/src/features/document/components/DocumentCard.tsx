import { FileText, Loader2, Brain, CircleHelp, Map } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Document } from "@/types/api/document.types";
import { Badge } from "@/components/ui/badge";

interface DocumentCardProps {
  document: Document;
}

export function DocumentCard({
  document,
}: DocumentCardProps) {
  const navigate = useNavigate();

  const processing = document.processing.status !== "READY";
  const fileType =
    document.file?.extension?.toUpperCase() || "FILE";

  return (
    <div
      onClick={() =>
        navigate(`/documents/${document.id}`)
      }
      className="
        cursor-pointer
        rounded-xl
        border
        bg-card
        p-5
        transition-all
        hover:-translate-y-1
        hover:shadow-lg
      "
    >
      <div className="flex items-center justify-between">

        <FileText className="h-10 w-10 text-primary" />

        {processing ? (
          <Loader2 className="h-5 w-5 animate-spin text-orange-500" />
        ) : (
          <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
            Ready
          </span>
        )}

      </div>

        <div className="mt-5 space-y-3">
            <h3 className="line-clamp-1 text-lg font-semibold">{document.title}</h3>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span>{fileType}</span>
                {document.processing.pageCount > 0 ? (
                  <>
                    <span>•</span>
                    <span>{document.processing.pageCount} pages</span>
                  </>
                ) : null}
            </div>

            <div className="flex flex-wrap gap-2">
                {document.ai.summaryGenerated && (
                    <Badge variant="secondary" className="gap-1">
                        <FileText className="h-3 w-3" />
                        Summary
                    </Badge>
                )}

                {document.ai.flashcardsGenerated && (
                    <Badge variant="secondary" className="gap-1">
                        <CircleHelp className="h-3 w-3" />
                        Flashcards
                    </Badge>
                )}

                {document.ai.quizGenerated && (
                    <Badge variant="secondary" className="gap-1">
                        <Brain className="h-3 w-3" />
                        Quiz
                    </Badge>
                )}

                {document.ai.roadmapGenerated && (
                    <Badge variant="secondary" className="gap-1">
                        <Map className="h-3 w-3" />
                        Roadmap
                    </Badge>
                )}
            </div>

            <div className="flex items-center justify-between">
                {processing ? (
                    <span className="text-orange-500 text-sm">Processing...</span>
                ) : (
                <span className="text-green-600 text-sm">Ready</span>
                )}
                <span className="text-xs text-muted-foreground">{new Date(document.updatedAt).toLocaleDateString()}</span>
            </div>
        </div>
    </div>
  );
}