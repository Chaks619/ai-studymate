import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import {
  MoreVertical,
  Pencil,
  Palette,
  Archive,
  Trash2,
} from "lucide-react";

interface WorkspaceCardMenuProps {
  onRename?: () => void;
  onColor?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
}

export function WorkspaceCardMenu({
  onRename,
  onColor,
  onArchive,
  onDelete,
}: WorkspaceCardMenuProps) {
  return (
    <DropdownMenu>
        <DropdownMenuTrigger className="rounded-md p-2 hover:bg-accent">
            <MoreVertical className="h-5 w-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onRename}>
                <Pencil className="mr-2 h-4 w-4" />
                Rename
            </DropdownMenuItem>

            <DropdownMenuItem onClick={onColor}>
                <Palette className="mr-2 h-4 w-4" />
                Change Color
            </DropdownMenuItem>

            <DropdownMenuItem onClick={onArchive}>
                <Archive className="mr-2 h-4 w-4" />
                Archive
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
                onClick={onDelete}
                className="text-destructive"
            >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  );
}