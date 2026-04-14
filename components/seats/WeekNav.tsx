import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WeekNavProps {
  currentWeekMonday: Date;
  onPrev: () => void;
  onNext: () => void;
}

export function WeekNav({ currentWeekMonday, onPrev, onNext }: WeekNavProps) {
  return (
    <div className="mb-4 space-y-3 reveal-up">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Workspace planner
        </p>
        <h1 className="text-xl font-bold tracking-tight">Seat Allocations</h1>
      </div>
      <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card/80 px-2 py-1 shadow-[0_10px_24px_rgba(8,41,56,0.14)] backdrop-blur-md">
        <Button variant="ghost" size="icon" onClick={onPrev} className="rounded-full border border-transparent hover:border-border/60">
          <ChevronLeft className="size-4" />
        </Button>
        <span className="min-w-0 flex-1 text-center text-sm font-medium">
          Week of {currentWeekMonday.toLocaleDateString()}
        </span>
        <Button variant="ghost" size="icon" onClick={onNext} className="rounded-full border border-transparent hover:border-border/60">
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
