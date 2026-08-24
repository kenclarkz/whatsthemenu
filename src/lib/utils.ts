export function toISODate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Monday-based week start for any date string/date. */
export function weekStart(date: Date | string = new Date()): string {
  const d = typeof date === "string" ? parseISODate(date) : new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return toISODate(d);
}

export function parseISODate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(iso: string, days: number): string {
  const d = parseISODate(iso);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

export function weekDates(weekStartISO: string, count = 7): string[] {
  return Array.from({ length: count }, (_, i) => addDays(weekStartISO, i));
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function dayName(iso: string): string {
  return DAY_NAMES[parseISODate(iso).getDay()];
}

export function shortDate(iso: string): string {
  const d = parseISODate(iso);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

export function longDate(iso: string): string {
  const d = parseISODate(iso);
  const fullDays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  return `${fullDays[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

export function isToday(iso: string): boolean {
  return iso === toISODate(new Date());
}

export function isPast(iso: string): boolean {
  return parseISODate(iso) < parseISODate(toISODate(new Date()));
}

export function formatRange(startISO: string, count = 7): string {
  const end = addDays(startISO, count - 1);
  const s = parseISODate(startISO);
  const e = parseISODate(end);
  if (s.getMonth() === e.getMonth()) {
    return `${MONTHS[s.getMonth()]} ${s.getDate()} – ${e.getDate()}`;
  }
  return `${shortDate(startISO)} – ${shortDate(end)}`;
}
