import { useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { UploadDocumentForm } from "./UploadDocumentForm";

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

  async function handleUpload(
    formData: FormData
  ) {
    if (!workspaceId) return;

    await uploadDocument({
      workspaceId,
      formData,
    }).unwrap();

    toast.success("Document uploaded successfully!");
    
    onOpenChange(false);
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