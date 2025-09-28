/**
 * Formats a number into a compact string representation
 * @param count - The number to format
 * @returns Formatted string (e.g., "1k", "1.5k", "1M", "999")
 */
export function formatCount(count: number): string {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return count.toString();
}
