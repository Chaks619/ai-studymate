import { UploadCloud, FileText, X } from "lucide-react";
import { useDropzone } from "react-dropzone";

import { Button } from "@/components/ui/button";

interface FileDropzoneProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

export function FileDropzone({
  file,
  onFileChange,
}: FileDropzoneProps) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    multiple: false,

    accept: {
      "application/pdf": [".pdf"],
    },

    maxSize: MAX_FILE_SIZE,

    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileChange(acceptedFiles[0]);
      }
    },
  });

  if (file) {
    return (
      <div className="rounded-xl border bg-muted/30 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-10 w-10 text-primary" />

            <div>
              <p className="font-medium">
                {file.name}
              </p>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>

                <p className="text-xs text-green-600">
                    ✓ PDF File
                </p>
            </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => onFileChange(null)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`
        flex
        cursor-pointer
        flex-col
        items-center
        justify-center
        rounded-xl
        border-2
        border-dashed
        p-10
        transition-all

        ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/30"
        }
      `}
    >
      <input {...getInputProps()} />

      <UploadCloud className="mb-4 h-12 w-12 text-primary" />

      <h3 className="font-semibold">
        {isDragActive
          ? "Drop your PDF here"
          : "Drag & Drop your PDF"}
      </h3>

      <p className="mt-2 text-sm text-muted-foreground">
        or click to browse files
      </p>

      <p className="mt-4 text-xs text-muted-foreground">
        PDF only • Max 25 MB
      </p>
    </div>
  );
}