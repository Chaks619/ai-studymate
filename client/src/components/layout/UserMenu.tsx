import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarFallback>
            {user?.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem disabled>
          {user?.email}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={logout}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}