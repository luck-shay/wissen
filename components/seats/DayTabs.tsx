import { Button } from "@/components/ui/button";
import { formatYMD, isDesignatedDay, isHoliday } from "@/lib/dateUtils";

interface DayTabsProps {
  weekDays: Date[];
  selectedDate: Date;
  onSelect: (d: Date) => void;
}

export function DayTabs({ weekDays, selectedDate, onSelect }: DayTabsProps) {
  const todayStr = formatYMD(new Date());

  return (
    <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
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
            className={`relative flex flex-col pb-6 pt-4 px-5 h-auto min-w-22.5 whitespace-nowrap rounded-xl transition-all${dayIsHoliday ? " opacity-55" : ""}`}
            onClick={() => onSelect(d)}
          >
            <span className="text-xs font-semibold uppercase tracking-wider opacity-60 mb-0.5">
              {d.toLocaleDateString(undefined, { weekday: "short" })}
            </span>
            <span className="text-lg font-bold">
              {d.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            </span>
            {dStr === todayStr && (
              <div className="absolute top-2 right-2 size-1.5 bg-primary rounded-full animate-pulse" />
            )}
            {dayIsHoliday ? (
              <span className="absolute bottom-1.5 left-0 right-0 text-center text-[9px] font-bold uppercase tracking-wider text-red-500">
                Holiday
              </span>
            ) : batchLabel ? (
              <span className="absolute bottom-1.5 left-0 right-0 text-center text-[9px] font-semibold uppercase tracking-wider opacity-45">
                {batchLabel}
              </span>
            ) : null}
          </Button>
        );
      })}
    </div>
  );
}
