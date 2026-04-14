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
    <div className="flex items-center gap-3 mb-4">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground shrink-0">
        {title}
      </h2>
      <div className="flex-1 border-t border-border" />
      <span className="text-xs text-muted-foreground shrink-0">{right}</span>
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
  const sharedCardProps = { userIsDesignated, canBookNonDesignated, userAlreadyBooked, actionLoading, onAction };

  return (
    <>
      {/* Legend */}
      <div className="mb-6 flex flex-wrap gap-x-4 gap-y-2">
        {LEGEND.map(({ cls, label }) => (
          <div key={label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className={`size-3.5 shrink-0 rounded border ${cls}`} />
            {label}
          </div>
        ))}
      </div>

      {/* Designated Seats 1–40 */}
      <div className="mb-10">
        <SectionDivider
          title="Designated Seats"
          right={designatedBatch ? `Batch ${designatedBatch} in office today` : "—"}
        />
        <div className="space-y-5">
          {squadBlocks.map(({ seatStart, seatEnd, squadNum }) => (
            <div key={squadNum}>
              <p className="text-xs font-medium text-muted-foreground mb-2">
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
      <div>
        <SectionDivider
          title="Floater Seats"
          right={canBookNonDesignated ? "Open to non-designated teams" : "Opens after 3 PM"}
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
