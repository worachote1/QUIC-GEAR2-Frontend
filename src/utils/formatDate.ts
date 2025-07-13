
// convert ISO dates to Thai time (UTC+7)
export function formatDateToReadable(iso: string): string {
  const date = new Date(iso);
  return isNaN(date.getTime())
    ? iso
    : date.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Bangkok',
    });
}