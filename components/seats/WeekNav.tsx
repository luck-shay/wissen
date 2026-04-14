import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WeekNavProps {
  currentWeekMonday: Date;
  onPrev: () => void;
  onNext: () => void;
}

export function WeekNav({ currentWeekMonday, onPrev, onNext }: WeekNavProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Seat Allocations</h1>
      <div className="flex items-center gap-3 bg-muted px-2 py-1 rounded-full">
        <Button variant="ghost" size="icon" onClick={onPrev} className="rounded-full">
          <ChevronLeft className="size-4" />
        </Button>
        <span className="text-sm font-medium">
          Week of {currentWeekMonday.toLocaleDateString()}
        </span>
        <Button variant="ghost" size="icon" onClick={onNext} className="rounded-full">
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
