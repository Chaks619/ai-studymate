import type { ComponentProps, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * The shared shell for every study tab (Summary / Flashcards / Quiz).
 * Keeping the chrome here is what makes the tabs feel like one product
 * rather than three separately-built screens.
 */
export function StudyPanel({
  icon: Icon,
  title,
  description,
  actions,
  children,
  className,
  contentClassName,
}: {
  icon: LucideIcon;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-foreground/[0.07]",
        className
      )}
    >
      <header className="flex flex-wrap items-center gap-x-3 gap-y-3 border-b border-border/60 px-5 py-4 sm:px-6">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-[1.125rem]" />
        </span>

        <div className="min-w-0 flex-1">
          <h2 className="font-heading text-sm font-semibold tracking-tight text-foreground">
            {title}
          </h2>

          {description ? (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>

        {actions ? (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        ) : null}
      </header>

      <div className={cn("p-5 sm:p-6", contentClassName)}>{children}</div>
    </section>
  );
}

/**
 * Shown when a document has no summary/flashcards/quiz yet. This is the
 * first thing most users see on a fresh document, so it carries the
 * primary call to action rather than apologising for being empty.
 */
export function StudyPanelEmpty({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center sm:py-16">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
        <Icon className="size-6" />
      </span>

      <h3 className="mt-5 font-heading text-base font-semibold tracking-tight text-foreground">
        {title}
      </h3>

      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-balance text-muted-foreground">
        {description}
      </p>

      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

/** Skeleton that mirrors the panel chrome, so loading doesn't shift layout. */
export function StudyPanelSkeleton({
  lines = 5,
  children,
}: {
  lines?: number;
  children?: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-foreground/[0.07]">
      <header className="flex items-center gap-3 border-b border-border/60 px-5 py-4 sm:px-6">
        <Skeleton className="size-9 shrink-0 rounded-xl" />

        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>

        <Skeleton className="h-8 w-24 rounded-lg" />
      </header>

      <div className="p-5 sm:p-6">
        {children ?? (
          <div className="space-y-3">
            {Array.from({ length: lines }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-4"
                // Ragged line lengths read as text far better than a uniform block.
                style={{ width: `${[100, 94, 97, 88, 92, 70][index % 6]}%` }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function StudyPanelError({
  title = "Something went wrong",
  description = "We couldn't load this just now. Try again in a moment.",
  action,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <h3 className="font-heading text-base font-semibold text-foreground">
        {title}
      </h3>

      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>

      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

/** Small label/value pair used in the document meta bar. */
export function MetaItem({
  icon: Icon,
  children,
  className,
  ...props
}: ComponentProps<"span"> & { icon?: LucideIcon }) {
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 whitespace-nowrap", className)}
      {...props}
    >
      {Icon ? <Icon className="size-3.5 shrink-0 opacity-70" /> : null}
      {children}
    </span>
  );
}
