import { DocumentCard } from "./DocumentCard";

import type { Document } from "@/types/api/document.types";

interface Props {
  documents: Document[];
}

export function DocumentGrid({
  documents,
}: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {documents.map((document) => (
        <DocumentCard
          key={document.id}
          document={document}
        />
      ))}
    </div>
  );
}