"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatYMD } from "@/lib/utils/dateUtils";

interface AdminPanelProps {
  selectedDate: Date;
  onRefresh: () => Promise<void>;
}

export function AdminPanel({ selectedDate, onRefresh }: AdminPanelProps) {
  const [vacateSeat, setVacateSeat] = useState(1);
  const [cancelSeat, setCancelSeat] = useState(1);
  const [userAEmail, setUserAEmail] = useState("");
  const [userBEmail, setUserBEmail] = useState("");
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const dateStr = formatYMD(selectedDate);

  const runAction = async (action: string, payload: Record<string, unknown>) => {
    setLoadingAction(action);
    try {
      const { data } = await axios.post("/api/admin/actions", {
        action,
        ...payload,
      });
      toast.success(data?.message || "Admin action completed");
      await onRefresh();
    } catch (error) {
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.error || "Admin action failed"
          : "Admin action failed",
      );
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="mt-4 space-y-3 rounded-2xl border border-cyan-500/25 bg-cyan-500/5 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-cyan-300">Admin Tools</p>

      <div className="space-y-2 rounded-xl border border-border/60 bg-background/40 p-2.5">
        <p className="text-xs font-semibold text-muted-foreground">Vacate Designated Seat</p>
        <Input
          type="number"
          min={1}
          max={40}
          value={vacateSeat}
          onChange={(e) => setVacateSeat(Number(e.target.value))}
        />
        <div className="grid grid-cols-2 gap-2">
          <Button
            size="sm"
            disabled={loadingAction !== null}
            onClick={() => runAction("vacate-seat", { date: dateStr, seatNumber: vacateSeat })}
          >
            {loadingAction === "vacate-seat" ? "Vacating..." : "Vacate"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={loadingAction !== null}
            onClick={() => runAction("undo-vacate", { date: dateStr, seatNumber: vacateSeat })}
          >
            {loadingAction === "undo-vacate" ? "Undoing..." : "Undo Vacate"}
          </Button>
        </div>
      </div>

      <div className="space-y-2 rounded-xl border border-border/60 bg-background/40 p-2.5">
        <p className="text-xs font-semibold text-muted-foreground">Cancel Any Booking</p>
        <Input
          type="number"
          min={1}
          max={50}
          value={cancelSeat}
          onChange={(e) => setCancelSeat(Number(e.target.value))}
        />
        <Button
          size="sm"
          variant="destructive"
          disabled={loadingAction !== null}
          onClick={() => runAction("cancel-booking", { date: dateStr, seatNumber: cancelSeat })}
        >
          {loadingAction === "cancel-booking" ? "Cancelling..." : "Cancel Booking"}
        </Button>
      </div>

      <div className="space-y-2 rounded-xl border border-border/60 bg-background/40 p-2.5">
        <p className="text-xs font-semibold text-muted-foreground">Swap Users&apos; Designated Seats</p>
        <Input
          type="email"
          placeholder="user-a@wissen.com"
          value={userAEmail}
          onChange={(e) => setUserAEmail(e.target.value)}
        />
        <Input
          type="email"
          placeholder="user-b@wissen.com"
          value={userBEmail}
          onChange={(e) => setUserBEmail(e.target.value)}
        />
        <Button
          size="sm"
          disabled={loadingAction !== null || !userAEmail || !userBEmail}
          onClick={() => runAction("swap-seats", { userAEmail, userBEmail })}
        >
          {loadingAction === "swap-seats" ? "Swapping..." : "Swap Seats"}
        </Button>
      </div>
    </div>
  );
}
