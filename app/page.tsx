"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { AppHeader } from "@/components/AppHeader";
import { Spinner } from "@/components/ui/spinner";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import {
  formatYMD,
  isDesignatedDay,
  isHoliday,
  isNonDesignatedBookingAllowed,
} from "@/lib/dateUtils";
import { WeekNav } from "@/components/seats/WeekNav";
import { DayTabs } from "@/components/seats/DayTabs";
import { ContextBanner } from "@/components/seats/ContextBanner";
import { SeatGrid } from "@/components/seats/SeatGrid";
import type {
  AllocationData,
  BookingRecord,
  SeatInfo,
  SeatStatus,
  UserRecord,
} from "@/components/seats/types";

// Derive the status of a single seat from today's bookings + the assigned owner.
function getSeatInfo(
  seatNumber: number,
  todaysBookings: BookingRecord[],
  assignedUsers: UserRecord[],
  userId: string,
): SeatInfo {
  const isFloater = seatNumber > 40;
  const owner = !isFloater
    ? (assignedUsers.find((u) => u.defaultSeat === seatNumber) ?? null)
    : null;

  const isReleased = todaysBookings.some(
    (b) => b.seatNumber === seatNumber && b.type === "release",
  );
  const activeBooking =
    todaysBookings.find(
      (b) => b.seatNumber === seatNumber && b.type === "book",
    ) ?? null;

  const isOwner = Boolean(owner && owner._id === userId);
  const bookedByUser = Boolean(activeBooking?.userId?._id === userId);

  let status: SeatStatus;
  if (isFloater) {
    if (bookedByUser) status = "booked-by-you";
    else if (activeBooking) status = "occupied";
    else status = "available-floater";
  } else {
    if (isOwner && !isReleased) status = "your-seat";
    else if (isOwner && isReleased && !activeBooking)
      status = "your-seat-vacated";
    else if (isOwner && isReleased) status = "your-seat-taken";
    else if (bookedByUser) status = "booked-by-you";
    else if (isReleased && !activeBooking) status = "available-released";
    else status = "occupied";
  }

  const occupant: SeatInfo["occupant"] = activeBooking?.userId
    ? { _id: activeBooking.userId._id, name: activeBooking.userId.name }
    : owner
      ? { _id: owner._id, name: owner.name }
      : null;

  return { status, occupant, isReleased, activeBooking };
}

export default function Home() {
  const { user, isReady } = useRequireAuth("/login?redirect=/");

  const [currentWeekMonday, setCurrentWeekMonday] = useState<Date>(() => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  });
  const [selectedDate, setSelectedDate] = useState<Date>(currentWeekMonday);
  const [allocation, setAllocation] = useState<AllocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const weekDays = useMemo(() => {
    return Array.from({ length: 5 }).map((_, i) => {
      const d = new Date(currentWeekMonday);
      d.setDate(currentWeekMonday.getDate() + i);
      return d;
    });
  }, [currentWeekMonday]);

  // Keep selectedDate in sync when the week changes.
  useEffect(() => {
    const inWeek = weekDays.some(
      (d) => formatYMD(d) === formatYMD(selectedDate),
    );
    if (!inWeek) setSelectedDate(weekDays[0]);
  }, [weekDays, selectedDate]);

  useEffect(() => {
    if (!isReady) return;
    void fetchAllocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, currentWeekMonday]);

  const fetchAllocation = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get<AllocationData>(
        `/api/seats?startDate=${formatYMD(weekDays[0])}&endDate=${formatYMD(weekDays[4])}`,
      );
      setAllocation(data);
    } catch {
      toast.error("Failed to load allocations");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (
    action: "book" | "release" | "cancel",
    seatNumber: number,
  ) => {
    setActionLoading(seatNumber);
    try {
      await axios.post("/api/seats/actions", {
        action,
        date: formatYMD(selectedDate),
        seatNumber,
      });
      toast.success("Action successful");
      await fetchAllocation();
    } catch (error) {
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.error || "Action failed"
          : "Action failed",
      );
    } finally {
      setActionLoading(null);
    }
  };

  if (!isReady) return null;

  // ── Derived state ────────────────────────────────────────────────────────────
  const dateStr = formatYMD(selectedDate);
  const todaysBookings =
    allocation?.bookings?.filter((b) => b.date === dateStr) || [];
  const selectedIsHoliday = isHoliday(dateStr);
  const designatedBatch = isDesignatedDay(1, selectedDate)
    ? 1
    : isDesignatedDay(2, selectedDate)
      ? 2
      : null;
  const userIsDesignated =
    user?.batch != null ? isDesignatedDay(user.batch as 1 | 2, dateStr) : false;
  const canBookNonDesignated = isNonDesignatedBookingAllowed(dateStr);
  const userAlreadyBooked = todaysBookings.some(
    (b) => b.type === "book" && b.userId?._id === user?.id,
  );
  const assignedUsers =
    allocation?.users?.filter((u) => u.batch === designatedBatch) || [];

  // Pre-compute seat info for all 50 seats.
  const seatInfos = new Map<number, SeatInfo>();
  for (let i = 1; i <= 50; i++) {
    seatInfos.set(
      i,
      getSeatInfo(i, todaysBookings, assignedUsers, user?.id ?? ""),
    );
  }

  const squadBlocks = Array.from({ length: 5 }).map((_, i) => ({
    seatStart: i * 8 + 1,
    seatEnd: i * 8 + 8,
    squadNum: designatedBatch === 2 ? i + 6 : i + 1,
  }));

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <AppHeader />
      <main className="max-w-6xl mx-auto px-4 pt-24 pb-12">
        <WeekNav
          currentWeekMonday={currentWeekMonday}
          onPrev={() => {
            const d = new Date(currentWeekMonday);
            d.setDate(d.getDate() - 7);
            setCurrentWeekMonday(d);
          }}
          onNext={() => {
            const d = new Date(currentWeekMonday);
            d.setDate(d.getDate() + 7);
            setCurrentWeekMonday(d);
          }}
        />

        <DayTabs
          weekDays={weekDays}
          selectedDate={selectedDate}
          onSelect={setSelectedDate}
        />

        {loading ? (
          <div className="flex justify-center p-12">
            <Spinner className="size-8" />
          </div>
        ) : selectedIsHoliday ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <span className="text-4xl">🎉</span>
            <p className="text-xl font-semibold">It&apos;s a holiday!</p>
            <p className="text-sm text-muted-foreground">
              Booking is not available on this day.
            </p>
          </div>
        ) : (
          <>
            <ContextBanner
              userIsDesignated={userIsDesignated}
              canBookNonDesignated={canBookNonDesignated}
            />
            <SeatGrid
              squadBlocks={squadBlocks}
              designatedBatch={designatedBatch}
              seatInfos={seatInfos}
              userIsDesignated={userIsDesignated}
              canBookNonDesignated={canBookNonDesignated}
              userAlreadyBooked={userAlreadyBooked}
              actionLoading={actionLoading}
              onAction={handleAction}
            />
          </>
        )}
      </main>
    </div>
  );
}
