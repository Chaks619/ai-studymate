import type { PropsWithChildren, ReactNode } from "react";

import { cn } from "@/lib/utils";

import type { Option } from "../settings.constants";

interface SectionProps {
  title: string;
  description: string;
}

export function SettingsSection({
  title,
  description,
  children,
}: PropsWithChildren<SectionProps>) {
  return (
    <section className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-foreground/[0.07] sm:p-6">
      <header className="mb-6">
        <h2 className="font-heading text-lg font-semibold tracking-tight">
          {title}
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </header>

      <div className="space-y-6">{children}</div>
    </section>
  );
}

interface FieldProps {
  label: string;
  description?: ReactNode;
  /** Renders the control beside the label instead of beneath it. */
  inline?: boolean;
  control?: ReactNode;
}

export function SettingsField({
  label,
  description,
  inline,
  control,
  children,
}: PropsWithChildren<FieldProps>) {
  if (inline) {
    return (
      <div className="flex items-center justify-between gap-6">
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">{label}</p>

          {description ? (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>

        <div className="shrink-0">{control}</div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>

        {description ? (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>

      {children}
    </div>
  );
}

interface OptionGroupProps<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Tailwind grid class — the caller knows how wide its labels are. */
  className?: string;
}

/**
 * A radio group drawn as cards. Uses aria-pressed toggle buttons rather than
 * inputs, matching how the generate dialogs already present their choices.
 */
export function OptionGroup<T extends string>({
  options,
  value,
  onChange,
  className,
}: OptionGroupProps<T>) {
  return (
    <div className={cn("grid gap-2", className)}>
      {options.map((option) => {
        const selected = option.value === value;
        const Icon = option.icon;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-lg border px-3 py-2.5 text-left transition-all",
              "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
              selected
                ? "border-primary bg-primary/10"
                : "border-border hover:bg-muted"
            )}
          >
            <span
              className={cn(
                "flex items-center gap-1.5 text-sm font-medium",
                selected ? "text-primary" : "text-foreground"
              )}
            >
              {Icon ? <Icon className="size-4" /> : null}
              {option.label}
            </span>

            {option.hint ? (
              <span className="mt-0.5 block text-xs text-muted-foreground">
                {option.hint}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

interface CountGroupProps {
  options: number[];
  value: number;
  onChange: (value: number) => void;
}

export function CountGroup({ options, value, onChange }: CountGroupProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = option === value;

        return (
          <button
            key={option}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option)}
            className={cn(
              "tabular flex h-11 w-14 items-center justify-center rounded-lg border text-sm font-medium transition-all",
              "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
              selected
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
