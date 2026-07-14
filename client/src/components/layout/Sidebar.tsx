import { NavLink, useLocation } from "react-router-dom";
import { BookOpen, ChevronRight, Settings } from "lucide-react";

import {
  DEFAULT_SETTINGS_SECTION,
  SETTINGS_SECTIONS,
} from "@/features/settings/settings.constants";
import { cn } from "@/lib/utils";

import { Logo } from "./Logo";

const linkClass = (isActive: boolean) =>
  cn(
    "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
    "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
    isActive
      ? "bg-primary/10 text-primary"
      : "text-muted-foreground hover:bg-muted hover:text-foreground"
  );

export function Sidebar() {
  const { pathname } = useLocation();

  // Expansion is derived from the route rather than held in state: you can
  // only be inside a settings section by navigating to one, so there's no
  // third state where the submenu is open but nothing under it is active.
  const inSettings = pathname.startsWith("/settings");

  return (
    <aside className="w-72 border-r">
      <div className="p-6">
        <Logo />
      </div>

      <nav className="space-y-1 px-3">
        <NavLink to="/" end className={({ isActive }) => linkClass(isActive)}>
          <BookOpen className="size-5" />
          Workspaces
        </NavLink>

        <NavLink
          to={`/settings/${DEFAULT_SETTINGS_SECTION}`}
          className={() => linkClass(inSettings)}
        >
          <Settings className="size-5" />
          Settings
          <ChevronRight
            className={cn(
              "ml-auto size-4 transition-transform",
              inSettings && "rotate-90"
            )}
          />
        </NavLink>

        {inSettings ? (
          // The rule down the left ties the sub-items back to their parent.
          <ul className="ml-6 space-y-0.5 border-l border-border pl-3">
            {SETTINGS_SECTIONS.map(({ slug, label, icon: Icon }) => (
              <li key={slug}>
                <NavLink
                  to={`/settings/${slug}`}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                      "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                      isActive
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )
                  }
                >
                  <Icon className="size-4" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        ) : null}
      </nav>
    </aside>
  );
}
