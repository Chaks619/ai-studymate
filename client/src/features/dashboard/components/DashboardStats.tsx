import type { LucideIcon } from "lucide-react";
import {
  CalendarClock,
  FolderKanban,
  Sparkles,
} from "lucide-react";

import type { Workspace } from "@/types/api/workspace.types";

import { useCountUp } from "./useCountUp";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function StatCard({
  icon: Icon,
  label,
  value,
  delay,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  delay: number;
}) {
  const animated = useCountUp(value);

  return (
    <div
      style={{ animationDelay: `${delay}ms` }}
      className="animate-enter flex items-center gap-4 rounded-2xl bg-card p-5 shadow-sm ring-1 ring-foreground/[0.07]"
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-5" />
      </span>

      <div className="min-w-0">
        <p className="text-2xl font-semibold tracking-tight tabular-nums">
          {animated}
        </p>

        <p className="truncate text-xs text-muted-foreground">
          {label}
        </p>
      </div>
    </div>
  );
}

/**
 * A small statistics strip for the dashboard. Every figure is derived from the
 * workspace list the page already has — no extra requests, and nothing that
 * depends on the server's usage counters (which aren't wired yet).
 */
export function DashboardStats({
  workspaces,
}: {
  workspaces: Workspace[];
}) {
  const now = Date.now();

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const openedThisWeek = workspaces.filter(
    (workspace) =>
      workspace.lastOpenedAt &&
      now - new Date(workspace.lastOpenedAt).getTime() <
        WEEK_MS
  ).length;

  const newThisMonth = workspaces.filter(
    (workspace) =>
      new Date(workspace.createdAt).getTime() >=
      startOfMonth.getTime()
  ).length;

  const stats = [
    {
      icon: FolderKanban,
      label: "Workspaces",
      value: workspaces.length,
    },
    {
      icon: CalendarClock,
      label: "Opened this week",
      value: openedThisWeek,
    },
    {
      icon: Sparkles,
      label: "New this month",
      value: newThisMonth,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat, index) => (
        <StatCard
          key={stat.label}
          icon={stat.icon}
          label={stat.label}
          value={stat.value}
          delay={index * 80}
        />
      ))}
    </div>
  );
}
