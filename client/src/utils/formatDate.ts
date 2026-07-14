export const formatDate = (date: Date | string, _format: string = 'MMM DD, YYYY'): string => {
  const d = new Date(date);
  // Simple date formatting implementation
  return d.toLocaleDateString();
};
