import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";

import { useAppSelector } from "@/app/hooks";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePreferences } from "@/features/settings/hooks/usePreferences";
import { cn } from "@/lib/utils";
import type { Theme } from "@/types/api/user.types";

export const THEMES: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

const triggerClass = cn(buttonVariants({ variant: "ghost", size: "icon" }));

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const { savePreferences } = usePreferences();

  const isAuthenticated = useAppSelector(
    (state) => state.auth.isAuthenticated
  );

  // next-themes only knows the stored theme after mount, so render a
  // neutral icon first to keep the first paint stable.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleChange(value: string) {
    // Switch immediately, then persist — the toggle stays responsive even
    // if the request is slow, and it still works signed out.
    setTheme(value);

    if (isAuthenticated) {
      void savePreferences({ theme: value as Theme });
    }
  }

  const active = THEMES.find((option) => option.value === theme) ?? THEMES[2];

  const ActiveIcon = mounted ? active.icon : Sun;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label="Change theme" className={triggerClass}>
        <ActiveIcon className="size-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={theme} onValueChange={handleChange}>
          {THEMES.map(({ value, label, icon: Icon }) => (
            <DropdownMenuRadioItem key={value} value={value}>
              <Icon className="size-4" />
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
