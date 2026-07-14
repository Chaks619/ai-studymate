import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const THEMES = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

const triggerClass = cn(
  buttonVariants({ variant: "ghost", size: "icon" })
);

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  // next-themes only knows the stored theme after mount, so render a
  // neutral icon first to keep the first paint stable.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const active =
    THEMES.find(t => t.value === theme) ?? THEMES[2];

  const ActiveIcon = mounted ? active.icon : Sun;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Change theme"
        className={triggerClass}
      >
        <ActiveIcon className="size-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={setTheme}
        >
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
