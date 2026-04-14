import { Button } from "@/components/ui/button";
import { formatYMD, isDesignatedDay, isHoliday } from "@/lib/utils/dateUtils";

interface DayTabsProps {
  weekDays: Date[];
  selectedDate: Date;
  onSelect: (d: Date) => void;
}

export function DayTabs({ weekDays, selectedDate, onSelect }: DayTabsProps) {
  const todayStr = formatYMD(new Date());

  return (
    <div className="mb-4 grid grid-cols-3 gap-2 rounded-2xl border border-border/60 bg-card/75 p-2 shadow-[0_10px_20px_rgba(9,37,52,0.1)] backdrop-blur-md reveal-up reveal-delay-1">
      {weekDays.map((d) => {
        const dStr = formatYMD(d);
        const isSelected = dStr === formatYMD(selectedDate);
        const dayIsHoliday = isHoliday(dStr);
        const batchLabel = isDesignatedDay(1, d)
          ? "Batch 1"
          : isDesignatedDay(2, d)
            ? "Batch 2"
            : null;

        return (
          <Button
            key={dStr}
            variant={isSelected ? "default" : "outline"}
            className={`relative flex h-auto min-w-0 flex-col items-center justify-center rounded-xl border px-2 py-2 text-center text-foreground whitespace-normal transition-all duration-200 ${isSelected ? "scale-[1.02] border-primary/35 shadow-[0_10px_18px_rgba(14,88,112,0.24)]" : "border-border/50 bg-background/70 hover:border-primary/25 hover:bg-background"}${dayIsHoliday ? " opacity-55" : ""}`}
            onClick={() => onSelect(d)}
          >
            <span className="block text-[10px] font-semibold uppercase tracking-[0.08em] opacity-70 leading-none">
              {d.toLocaleDateString(undefined, { weekday: "short" })}
            </span>
            <span className="mt-0.5 block text-sm font-bold leading-none">
              {d.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            </span>
            {dStr === todayStr && (
              <div className="absolute top-2 right-2 size-1.5 bg-primary rounded-full animate-pulse" />
            )}
            {dayIsHoliday ? (
              <span className="mt-1 block text-center text-[9px] font-bold uppercase tracking-[0.06em] text-red-400 leading-none">
                Holiday
              </span>
            ) : batchLabel ? (
              <span className="mt-1 block text-center text-[9px] font-semibold uppercase tracking-[0.06em] opacity-65 leading-none">
                {batchLabel}
              </span>
            ) : null}
          </Button>
        );
      })}
    </div>
  );
}
