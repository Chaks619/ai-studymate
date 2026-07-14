import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileDropzone } from "./FileDropzone";

interface Props {
  onSubmit: (data: FormData) => Promise<void>;
  isUploading: boolean;
}

export function UploadDocumentForm({
  onSubmit,
  isUploading,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [titleEdited, setTitleEdited] = useState(false);
  const [description, setDescription] = useState("");

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);

    await onSubmit(formData);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div className="space-y-2">
        <label className="text-sm font-medium">
          PDF File
        </label>

        <FileDropzone
            file={file}
            onFileChange={(selectedFile) => {
                setFile(selectedFile);
                if (selectedFile && !titleEdited) {
                    const generatedTitle = selectedFile.name.replace(/\.pdf$/i, "").replace(/[_-]/g, " ");
                    setTitle(generatedTitle);
                }
            }}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Title
        </label>

        <Input
            value={title}
            onChange={(e) => {
            setTitle(e.target.value);
            setTitleEdited(true);
            }}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Description
        </label>

        <Textarea
          rows={4}
          value={description}
          onChange={(e) =>
            setDescription(
              e.target.value
            )
          }
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="submit"
          disabled={!file || isUploading}
        >
          {isUploading
            ? "Uploading..."
            : "Upload PDF"}
        </Button>
      </div>
    </form>
  );
}