export function getISOWeek(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

export function groupByWeek(digests: any[]): Record<string, any[]> {
  const map: Record<string, any[]> = {};
  for (const entry of digests) {
    const w = getISOWeek(entry.data.date);
    if (!map[w]) map[w] = [];
    map[w].push(entry);
  }
  return map;
}
