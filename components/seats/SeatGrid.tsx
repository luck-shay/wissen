import { SeatCard } from "./SeatCard";
import { SeatInfo, LEGEND } from "./types";

interface SquadBlock {
  seatStart: number;
  seatEnd: number;
  squadNum: number;
}

interface SeatGridProps {
  squadBlocks: SquadBlock[];
  designatedBatch: 1 | 2 | null;
  seatInfos: Map<number, SeatInfo>;
  userIsDesignated: boolean;
  canBookNonDesignated: boolean;
  userAlreadyBooked: boolean;
  actionLoading: number | null;
  onAction: (action: "book" | "release" | "cancel", seatNumber: number) => void;
}

function SectionDivider({
  title,
  right,
}: {
  title: string;
  right: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="shrink-0 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {title}
      </h2>
      <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
      <span className="shrink-0 text-xs text-muted-foreground">{right}</span>
    </div>
  );
}

export function SeatGrid({
  squadBlocks,
  designatedBatch,
  seatInfos,
  userIsDesignated,
  canBookNonDesignated,
  userAlreadyBooked,
  actionLoading,
  onAction,
}: SeatGridProps) {
  const sharedCardProps = {
    userIsDesignated,
    canBookNonDesignated,
    userAlreadyBooked,
    actionLoading,
    onAction,
  };

  return (
    <>
      {/* Legend */}
      <div className="glass-panel reveal-up reveal-delay-1 mb-6 flex flex-wrap gap-x-4 gap-y-2 rounded-2xl p-4 shadow-[0_10px_24px_rgba(9,37,52,0.12)]">
        {LEGEND.map(({ cls, label }) => (
          <div key={label} className="flex items-center gap-1.5 text-xs text-muted-foreground/90">
            <div className={`size-3.5 shrink-0 rounded border ${cls}`} />
            {label}
          </div>
        ))}
      </div>

      {/* Designated Seats 1–40 */}
      <div className="glass-panel reveal-up reveal-delay-2 mb-10 rounded-2xl p-4 shadow-[0_12px_24px_rgba(8,36,51,0.12)] sm:p-5">
        <SectionDivider
          title="Designated Seats"
          right={designatedBatch ? `Batch ${designatedBatch} in office today` : "—"}
        />
        <div className="space-y-5">
          {squadBlocks.map(({ seatStart, seatEnd, squadNum }) => (
            <div key={squadNum}>
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                Squad {squadNum}
                <span className="opacity-50"> · seats {seatStart}–{seatEnd}</span>
              </p>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {Array.from({ length: 8 }).map((_, i) => {
                  const seat = seatStart + i;
                  return (
                    <SeatCard
                      key={seat}
                      seatNumber={seat}
                      info={seatInfos.get(seat)!}
                      {...sharedCardProps}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floater Seats 41–50 */}
      <div className="glass-panel reveal-up reveal-delay-2 rounded-2xl p-4 shadow-[0_12px_24px_rgba(8,36,51,0.12)] sm:p-5">
        <SectionDivider
          title="Floater Seats"
          right={canBookNonDesignated ? "Open to non-designated teams" : "Opens at 3 PM"}
        />
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {Array.from({ length: 10 }).map((_, i) => {
            const seat = 41 + i;
            return (
              <SeatCard
                key={seat}
                seatNumber={seat}
                info={seatInfos.get(seat)!}
                {...sharedCardProps}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
