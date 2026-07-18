import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

import { CreateWorkspaceDialog } from "./CreateWorkspaceDialog";

interface Props {
  query: string;
  onQueryChange: (value: string) => void;
  showSearch: boolean;
}

export function DashboardHeader({
  query,
  onQueryChange,
  showSearch,
}: Props) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
          My Workspaces
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Organize your study materials.
        </p>
      </div>

      <div className="flex items-center gap-2">
        {showSearch ? (
          <div className="relative flex-1 sm:flex-none">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={query}
              onChange={(event) =>
                onQueryChange(event.target.value)
              }
              placeholder="Search workspaces…"
              aria-label="Search workspaces"
              className="w-full pl-9 sm:w-64"
            />
          </div>
        ) : null}

        <CreateWorkspaceDialog />
      </div>
    </div>
  );
}
