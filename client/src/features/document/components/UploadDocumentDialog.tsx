import { useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { UploadDocumentForm } from "./UploadDocumentForm";

import { useAutoGenerate } from "../hooks/useAutoGenerate";
import { useUploadDocument } from "../hooks/useUploadDocument";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadDocumentDialog({
  open,
  onOpenChange,
}: Props) {
  const { workspaceId } = useParams();

  const {
    uploadDocument,
    isLoading,
  } = useUploadDocument();

  const autoGenerate = useAutoGenerate();

  async function handleUpload(
    formData: FormData
  ) {
    if (!workspaceId) return;

    const document = await uploadDocument({
      workspaceId,
      formData,
    }).unwrap();

    toast.success("Document uploaded successfully!");

    onOpenChange(false);

    // Not awaited: the dialog is already closed and each generation reports
    // its own progress, so there's nothing left for the caller to wait on.
    void autoGenerate(document);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Upload PDF
          </DialogTitle>
        </DialogHeader>

        <UploadDocumentForm
          onSubmit={handleUpload}
          isUploading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}