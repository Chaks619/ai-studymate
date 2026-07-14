import { Link } from "react-router-dom";
import { LogOut, Settings } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAppSelector } from "@/app/hooks";

import { useLogout } from "@/features/auth/hooks/useLogout";

export function UserMenu() {
  const logout = useLogout();

  const user = useAppSelector(
    state => state.auth.user
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">
        <Avatar>
          {user?.avatar?.url ? (
            <AvatarImage src={user.avatar.url} alt={user.name} />
          ) : null}

          <AvatarFallback>
            {user?.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <div className="px-1.5 py-1.5">
          <p className="truncate text-sm font-medium text-foreground">
            {user?.name}
          </p>

          <p className="truncate text-xs text-muted-foreground">
            {user?.email}
          </p>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem render={<Link to="/settings" />}>
          <Settings />
          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={logout}>
          <LogOut />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
