import { useState } from "react";

import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";

import { UploadDocumentDialog } from "./UploadDocumentDialog";

export function UploadDocumentButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="gap-2"
      >
        <Upload className="h-4 w-4" />

        Upload PDF
      </Button>

      <UploadDocumentDialog
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}