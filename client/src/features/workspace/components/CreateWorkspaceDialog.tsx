import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { WorkspaceForm } from "./WorkspaceForm";
import { useCreateWorkspace } from "../hooks/useCreateWorkspace";

import type { WorkspaceFormData } from "../workspace.schema";

export function CreateWorkspaceDialog() {
  const [open, setOpen] = useState(false);

  const { createWorkspace, isLoading } =
    useCreateWorkspace({
      onSuccess: () => setOpen(false),
    });

  const handleSubmit = async (
    data: WorkspaceFormData
  ) => {
    await createWorkspace(data);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger render={<Button>+ New Workspace</Button>}/>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create Workspace
          </DialogTitle>
        </DialogHeader>

        <WorkspaceForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}