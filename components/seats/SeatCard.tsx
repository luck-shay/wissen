import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { SeatInfo, STATUS_STYLES } from "./types";

function ActionButton({
  label,
  variant = "default",
  isLoading,
  onClick,
}: {
  label: string;
  variant?: "default" | "outline" | "destructive";
  isLoading: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      size="sm"
      variant={variant}
      className={`h-7 w-full rounded-full px-2 text-[9px] leading-none font-semibold tracking-wide whitespace-nowrap${
        variant === "outline" && label === "Undo Vacate"
          ? " bg-background border-orange-400/50 text-orange-600"
          : variant === "outline"
            ? " bg-background"
            : ""
      }`}
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? <Spinner className="size-3" /> : label}
    </Button>
  );
}

interface SeatCardProps {
  seatNumber: number;
  info: SeatInfo;
  /** Is today a designated day for the logged-in user? */
  userIsDesignated: boolean;
  /** Is the non-designated booking window currently open? */
  canBookNonDesignated: boolean;
  /** Has the user already booked any seat today? */
  userAlreadyBooked: boolean;
  actionLoading: number | null;
  onAction: (action: "book" | "release" | "cancel", seatNumber: number) => void;
}

export function SeatCard({
  seatNumber,
  info,
  userIsDesignated,
  canBookNonDesignated,
  userAlreadyBooked,
  actionLoading,
  onAction,
}: SeatCardProps) {
  const { status, occupant, isReleased, activeBooking } = info;
  const isFloater = seatNumber > 40;
  const isLoadingThis = actionLoading === seatNumber;

  const floaterLocked =
    isFloater && status === "available-floater" && !userIsDesignated && !canBookNonDesignated;

  // A seat is bookable (Book button should show) when:
  // • it's a vacated designated seat and user is not designated, OR
  // • it's a free floater and the booking window is open and user is not designated
  // In both cases: user must not have already booked something today.
  const canBook =
    !userAlreadyBooked &&
    !userIsDesignated &&
    (status === "available-released" ||
      (status === "available-floater" && canBookNonDesignated));

  return (
    <div
      className={`relative flex min-h-26 flex-col justify-between rounded-xl border p-2.5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_22px_rgba(10,43,59,0.2)] ${STATUS_STYLES[status]}${floaterLocked ? " opacity-40" : ""}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-8 rounded-t-xl bg-gradient-to-b from-white/30 to-transparent" />
      <span className="text-[10px] font-mono font-semibold text-muted-foreground">
        #{seatNumber}
      </span>

      {/* Occupant / state indicator */}
      <div className="flex flex-col items-center gap-1 py-1">
        {floaterLocked ? (
          <>
            <Lock className="size-3.5 text-muted-foreground" />
            <span className="text-[9px] text-muted-foreground">After 3 PM</span>
          </>
        ) : occupant ? (
          <>
            <div className="flex size-7 items-center justify-center rounded-full bg-secondary text-[11px] font-bold text-secondary-foreground shadow-inner">
              {occupant.name.charAt(0).toUpperCase()}
            </div>
            <p className="max-w-18 truncate text-center text-[10px] font-medium leading-tight">
              {occupant.name}
            </p>
            {status === "your-seat-taken" && (
              <span className="rounded-full bg-orange-500/15 px-1.5 py-0.5 text-[9px] font-semibold text-orange-500">taken</span>
            )}
          </>
        ) : (
          <span className="text-[10px] font-semibold text-primary/70">
            FREE
          </span>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-1">
        {status === "your-seat" && (
          <ActionButton
            label="Vacate"
            variant="outline"
            isLoading={isLoadingThis}
            onClick={() => onAction("release", seatNumber)}
          />
        )}

        {status === "your-seat-vacated" && (
          <ActionButton
            label="Undo"
            variant="outline"
            isLoading={isLoadingThis}
            onClick={() => onAction("cancel", seatNumber)}
          />
        )}

        {canBook && (
          <ActionButton
            label="Book"
            isLoading={isLoadingThis}
            onClick={() => onAction("book", seatNumber)}
          />
        )}

        {status === "booked-by-you" && activeBooking && !isReleased && (
          <ActionButton
            label="Cancel"
            variant="destructive"
            isLoading={isLoadingThis}
            onClick={() => onAction("cancel", seatNumber)}
          />
        )}
      </div>
    </div>
  );
}
