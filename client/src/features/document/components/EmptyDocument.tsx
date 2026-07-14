import { FileText } from "lucide-react";

export function EmptyDocuments() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-24">
      <FileText className="mb-5 h-16 w-16 text-muted-foreground" />

      <h2 className="text-xl font-semibold">
        No documents yet
      </h2>

      <p className="mt-2 text-muted-foreground">
        Upload your first PDF to generate summaries,
        quizzes and flashcards.
      </p>
    </div>
  );
}