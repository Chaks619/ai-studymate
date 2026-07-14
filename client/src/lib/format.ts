const WORDS_PER_MINUTE = 200;

export function formatBytes(bytes: number): string {
  if (!bytes) return "0 KB";

  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );

  const value = bytes / Math.pow(1024, exponent);

  return `${value >= 10 || exponent === 0 ? Math.round(value) : value.toFixed(1)} ${units[exponent]}`;
}

/** "Today", "Yesterday", "3 days ago", then falls back to an absolute date. */
export function formatRelativeDate(input: string | Date): string {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return "";

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const startOfDate = new Date(date);
  startOfDate.setHours(0, 0, 0, 0);

  const days = Math.round(
    (startOfToday.getTime() - startOfDate.getTime()) / 86_400_000
  );

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days > 1 && days < 7) return `${days} days ago`;

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: date.getFullYear() === startOfToday.getFullYear() ? undefined : "numeric",
  });
}

export function readingTimeMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;

  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export function pluralize(count: number, singular: string, plural?: string) {
  return `${count} ${count === 1 ? singular : (plural ?? `${singular}s`)}`;
}
