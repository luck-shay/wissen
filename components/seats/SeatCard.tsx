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
      className={`h-6 text-[10px] w-full${
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
  /** Has the 3 PM gate passed so non-designated users can book? */
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
  // • it's a free floater and the 3 PM gate has passed and user is not designated
  // In both cases: user must not have already booked something today.
  const canBook =
    !userAlreadyBooked &&
    !userIsDesignated &&
    (status === "available-released" ||
      (status === "available-floater" && canBookNonDesignated));

  return (
    <div
      className={`relative p-2.5 flex flex-col justify-between border rounded-xl shadow-sm min-h-26 ${STATUS_STYLES[status]}${floaterLocked ? " opacity-40" : ""}`}
    >
      <span className="text-[10px] font-mono text-muted-foreground">
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
            <div className="size-7 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center font-bold text-[11px]">
              {occupant.name.charAt(0).toUpperCase()}
            </div>
            <p className="text-[10px] leading-tight font-medium max-w-18 truncate text-center">
              {occupant.name}
            </p>
            {status === "your-seat-taken" && (
              <span className="text-[9px] text-orange-500">taken</span>
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
            label="Undo Vacate"
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
