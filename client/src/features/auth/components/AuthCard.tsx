import type { PropsWithChildren } from "react";

export function AuthCard({
  title,
  subtitle,
  children,
}: PropsWithChildren<{
  title: string;
  subtitle: string;
}>) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-6">
      <div className="w-full max-w-md rounded-xl border bg-card p-8 shadow-sm">
        <div className="mb-8 space-y-2 text-center">
          <h1 className="text-3xl font-bold">{title}</h1>

          <p className="text-muted-foreground">
            {subtitle}
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}