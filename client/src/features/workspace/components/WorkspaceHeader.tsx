import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

import type { Workspace } from "@/types/api/workspace.types";

interface WorkspaceHeaderProps {
  workspace: Workspace;
}

export function WorkspaceHeader({
  workspace,
}: WorkspaceHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => navigate("/")}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />

        Back
      </Button>

      <div>
        <h1 className="text-3xl font-bold">
          {workspace.name}
        </h1>

        <p className="mt-2 text-muted-foreground">
          {workspace.description}
        </p>
      </div>
    </div>
  );
}