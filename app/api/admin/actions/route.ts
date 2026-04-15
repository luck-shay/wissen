import { NextRequest, NextResponse } from "next/server";
import "@/lib/db";
import Booking from "@/models/Booking";
import User from "@/models/User";
import { getSession } from "@/lib/utils/api-utils";
import { isDesignatedDay, isHoliday } from "@/lib/utils/dateUtils";

async function requireAdmin() {
  const session = await getSession();
  if (!session?.user || session.user.role !== "admin") return null;
  return session.user;
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { action } = body as { action?: string };

    if (action === "vacate-seat") {
      const { date, seatNumber } = body as { date?: string; seatNumber?: number };
      if (!date || !seatNumber) {
        return NextResponse.json({ error: "date and seatNumber are required" }, { status: 400 });
      }
      if (seatNumber < 1 || seatNumber > 40) {
        return NextResponse.json({ error: "Only designated seats (1-40) can be vacated" }, { status: 400 });
      }
      if (isHoliday(date)) {
        return NextResponse.json({ error: "Cannot vacate on a holiday" }, { status: 400 });
      }

      const designatedBatch = isDesignatedDay(1, date)
        ? 1
        : isDesignatedDay(2, date)
          ? 2
          : null;

      if (!designatedBatch) {
        return NextResponse.json({ error: "Invalid office day for vacate action" }, { status: 400 });
      }

      const owner = await User.findOne({ batch: designatedBatch, defaultSeat: seatNumber });
      if (!owner) {
        return NextResponse.json({ error: "No seat owner found for this seat and date" }, { status: 404 });
      }

      const existingSeatBookings = await Booking.find({ date, seatNumber });
      const alreadyReleased = existingSeatBookings.some((b) => b.type === "release");
      if (alreadyReleased) {
        return NextResponse.json({ success: true, message: "Seat is already vacated" });
      }

      const releaseBooking = new Booking({
        userId: owner._id,
        date,
        type: "release",
        seatNumber,
      });
      await releaseBooking.save();

      return NextResponse.json({ success: true, message: "Seat vacated successfully" });
    }

    if (action === "undo-vacate") {
      const { date, seatNumber } = body as { date?: string; seatNumber?: number };
      if (!date || !seatNumber) {
        return NextResponse.json({ error: "date and seatNumber are required" }, { status: 400 });
      }

      const deleted = await Booking.findOneAndDelete({ date, seatNumber, type: "release" });
      if (!deleted) {
        return NextResponse.json({ error: "No vacate record found for this seat/date" }, { status: 404 });
      }

      return NextResponse.json({ success: true, message: "Vacate action undone" });
    }

    if (action === "cancel-booking") {
      const { date, seatNumber } = body as { date?: string; seatNumber?: number };
      if (!date || !seatNumber) {
        return NextResponse.json({ error: "date and seatNumber are required" }, { status: 400 });
      }

      const deleted = await Booking.findOneAndDelete({ date, seatNumber, type: "book" });
      if (!deleted) {
        return NextResponse.json({ error: "No booking found for this seat/date" }, { status: 404 });
      }

      return NextResponse.json({ success: true, message: "Booking cancelled" });
    }

    if (action === "swap-seats") {
      const { userAEmail, userBEmail } = body as { userAEmail?: string; userBEmail?: string };
      if (!userAEmail || !userBEmail) {
        return NextResponse.json({ error: "userAEmail and userBEmail are required" }, { status: 400 });
      }

      const emailA = userAEmail.toLowerCase();
      const emailB = userBEmail.toLowerCase();
      if (emailA === emailB) {
        return NextResponse.json({ error: "Provide two different users" }, { status: 400 });
      }

      const [userA, userB] = await Promise.all([
        User.findOne({ email: emailA }),
        User.findOne({ email: emailB }),
      ]);

      if (!userA || !userB) {
        return NextResponse.json({ error: "One or both users were not found" }, { status: 404 });
      }
      if (userA.role === "admin" || userB.role === "admin") {
        return NextResponse.json({ error: "Cannot swap seats for admin users" }, { status: 400 });
      }
      if (userA.batch !== userB.batch) {
        return NextResponse.json({ error: "Users must belong to the same batch to swap seats" }, { status: 400 });
      }

      const seatA = userA.defaultSeat;
      userA.defaultSeat = userB.defaultSeat;
      userB.defaultSeat = seatA;
      await Promise.all([userA.save(), userB.save()]);

      return NextResponse.json({ success: true, message: "Seats swapped successfully" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
