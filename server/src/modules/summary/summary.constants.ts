export const SUMMARY_STATUS = {
  GENERATING: "GENERATING",
  READY: "READY",
  FAILED: "FAILED",
} as const;

export type SummaryStatus =
  (typeof SUMMARY_STATUS)[keyof typeof SUMMARY_STATUS];