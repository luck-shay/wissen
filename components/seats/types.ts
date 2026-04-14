export interface BookingRecord {
  _id: string;
  date: string;
  seatNumber: number;
  type: "release" | "book" | "holiday";
  userId: {
    _id: string;
    name: string;
    email: string;
    squad: number;
    batch: number;
    defaultSeat: number;
  } | null;
}

export interface UserRecord {
  _id: string;
  name: string;
  email: string;
  batch: number;
  defaultSeat: number;
}

export interface AllocationData {
  bookings: BookingRecord[];
  users: UserRecord[];
}

export type SeatStatus =
  | "your-seat"          // you own this seat and are in office
  | "your-seat-vacated"  // you vacated it, not yet taken
  | "your-seat-taken"    // you vacated it, someone else booked it
  | "booked-by-you"      // you booked a floater or released seat
  | "occupied"           // someone else is here
  | "available-released" // owner vacated — free to book
  | "available-floater"; // free floater seat (may be time-gated)

export interface SeatInfo {
  status: SeatStatus;
  occupant: { _id: string; name: string } | null;
  isReleased: boolean;
  activeBooking: BookingRecord | null;
}

export const STATUS_STYLES: Record<SeatStatus, string> = {
  "your-seat":
    "bg-green-500/15 border-green-500/40 ring-1 ring-green-500/50",
  "your-seat-vacated":
    "bg-orange-500/10 border-orange-400/40 ring-1 ring-orange-400/50",
  "your-seat-taken":
    "bg-green-500/5 border-green-500/20",
  "booked-by-you":
    "bg-green-500/15 border-green-500/40 ring-1 ring-green-500/50",
  occupied:
    "bg-muted/40 border-muted",
  "available-released":
    "bg-sky-500/10 border-sky-500/30 hover:bg-sky-500/15 transition-colors cursor-pointer",
  "available-floater":
    "bg-blue-500/5 border-blue-500/20",
};

export const LEGEND = [
  { cls: "bg-green-500/15 border-green-500/40 ring-1 ring-green-500/50",     label: "Your seat / booked by you" },
  { cls: "bg-orange-500/10 border-orange-400/40 ring-1 ring-orange-400/50",  label: "You vacated - open for others" },
  { cls: "bg-sky-500/10 border-sky-500/30",                                  label: "Vacated - available to book" },
  { cls: "bg-blue-500/10 border-blue-500/30",                                label: "Floater - available" },
  { cls: "bg-muted/40 border-muted",                                         label: "Occupied" },
  { cls: "bg-muted/20 border-muted/30 opacity-50",                           label: "Locked (opens 3 PM)" },
];
