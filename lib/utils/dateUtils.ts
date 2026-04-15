// lib/dateUtils.ts
export function getISOWeek(date: Date): number {
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }
  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
}

export function getISODay(date: Date): number {
  const day = date.getDay();
  return day === 0 ? 7 : day;
}

// Parse a YYYY-MM-DD string as a local date (avoids UTC midnight timezone bugs).
export function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

// YYYY-MM-DD strings used by booking validation.
const HOLIDAYS = new Set<string>([
  '2026-01-01', // New Year
  '2026-01-26', // Republic Day
  '2026-03-06', // Holi
  '2026-08-15', // Independence Day
  '2026-10-02', // Gandhi Jayanti
  '2026-11-12', // Diwali (approx)
  '2026-12-25', // Christmas
]);

export function isHoliday(dateString: string): boolean {
  return HOLIDAYS.has(dateString);
}

// Returns the next Mon–Fri work day (skipping weekends and holidays) after `from`.
export function getNextWorkDay(from: Date): Date {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + 1);
  while (d.getDay() === 0 || d.getDay() === 6 || isHoliday(formatYMD(d))) {
    d.setDate(d.getDate() + 1);
  }
  return d;
}

// Logic for Batch Schedule
export function isDesignatedDay(batch: 1 | 2, dateInput: string | Date): boolean {
  const date =
    typeof dateInput === "string" ? parseLocalDate(dateInput) : dateInput;
  const isoWeek = getISOWeek(date);
  const isoDay = getISODay(date);

  if (isoDay > 5) return false; // Weekend

  const isWeek1 = isoWeek % 2 !== 0;

  if (isWeek1) {
    if (batch === 1) return isoDay >= 1 && isoDay <= 3; // Mon-Wed
    if (batch === 2) return isoDay >= 4 && isoDay <= 5; // Thu-Fri
  } else {
    // Week 2
    if (batch === 1) return isoDay >= 4 && isoDay <= 5; // Thu-Fri
    if (batch === 2) return isoDay >= 1 && isoDay <= 3; // Mon-Wed
  }
  return false;
}

// Check if booking is allowed today for a non-designated day.
// Rule: non-designated seats open in the 3 PM -> 10 AM window for the *next work day* only.
// Booking for today (same-day) is always allowed.
export function isNonDesignatedBookingAllowed(
  targetDateStr: string,
  now: Date = new Date(),
): boolean {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDate = parseLocalDate(targetDateStr);

  const todayStr = formatYMD(today);
  const targetStr = formatYMD(targetDate);

  // Same day: always allowed.
  if (targetStr === todayStr) return true;

  // Past: not allowed.
  if (targetDate < today) return false;

  // Next work day (skipping weekends + holidays): only allowed in the 3 PM -> 10 AM window.
  const hour = now.getHours();
  const withinBookingWindow = hour >= 15 || hour < 10;

  const nextWorkDay = getNextWorkDay(today);
  if (targetStr === formatYMD(nextWorkDay)) {
    return process.env.NODE_ENV === "development" || withinBookingWindow;
  }

  // Any date beyond next work day: not allowed (bypassed in dev mode).
  return process.env.NODE_ENV === "development";
}

export function formatYMD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
