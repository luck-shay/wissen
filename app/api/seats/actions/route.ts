import { NextRequest, NextResponse } from "next/server";
import "@/lib/db";
import Booking from "@/models/Booking";
import User, { IUserDocument } from "@/models/User";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { isNonDesignatedBookingAllowed, isDesignatedDay, isHoliday } from "@/lib/utils/dateUtils";

async function getUserFromReq(): Promise<IUserDocument | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload?.userId) return null;
  return User.findById(payload.userId);
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromReq();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { action, date, seatNumber } = body;
    // action can be: 'release', 'book', 'cancel'
    if (!date) return NextResponse.json({ error: "date is required" }, { status: 400 });

    if (isHoliday(date)) {
      return NextResponse.json({ error: "Booking on holidays is not allowed" }, { status: 400 });
    }

    const _isDesignated = isDesignatedDay(user.batch as 1 | 2, date);

    if (action === "release") {
      if (!_isDesignated) {
        return NextResponse.json({ error: "Can only release seats on designated days" }, { status: 400 });
      }

      if (seatNumber !== undefined && seatNumber !== user.defaultSeat) {
        return NextResponse.json(
          { error: "You can only release your own designated seat" },
          { status: 403 },
        );
      }
      
      const existing = await Booking.findOne({ userId: user._id, date });
      if (existing) return NextResponse.json({ error: "Already acted on this date" }, { status: 400 });

      const newBooking = new Booking({ userId: user._id, date, type: "release", seatNumber: user.defaultSeat });
      await newBooking.save();
      return NextResponse.json({ success: true, booking: newBooking });
      
    } else if (action === "book") {
      if (_isDesignated) {
        return NextResponse.json({ error: "You already have a designated seat on this day" }, { status: 400 });
      }

      // Check 3 PM rule for non-designated bookings!
      const canBook = isNonDesignatedBookingAllowed(date);
      if (!canBook) {
        return NextResponse.json({ error: "Booking for future non-designated days is only allowed after 3 PM of the prior work day." }, { status: 403 });
      }

      if (!seatNumber) return NextResponse.json({ error: "seatNumber required to book" }, { status: 400 });

      // Check if seat is currently available
      // It is available if:
      // 1. It is a floater seat (41-50) AND NOT booked by someone else
      // 2. It is a designated seat (1-40) BUT the owner has released it AND it is not booked by someone else
      // Wait, who is the owner of a designated seat?
      // 40 seats are shared between Batch 1 and Batch 2.
      // E.g. seat 5 on a Batch 1 day belongs to Batch 1's user whose defaultSeat is 5.
      
      // Is seat already booked explicitly by someone else?
      const existingBookings = await Booking.find({ date, seatNumber });
      const activelyBooked = existingBookings.some(b => b.type === "book");
      if (activelyBooked) {
         return NextResponse.json({ error: "Seat is already taken by a floater" }, { status: 400 });
      }

      if (seatNumber <= 40) {
        // Designated seat. Is it released by its owner?
        // We know its owner based on the date's designated batch.
        // E.g., if today is Batch 1 designated, we need to see if the Batch 1 user assigned to this seat released it.
        const releasedByOwner = existingBookings.some(b => b.type === "release");
        if (!releasedByOwner) {
           return NextResponse.json({ error: "This designated seat has not been released by its owner." }, { status: 400 });
        }
      }

      // Ensure user hasn't already booked something today
      const userBooking = await Booking.findOne({ userId: user._id, date });
      if (userBooking) return NextResponse.json({ error: "You already have an active request for this date" }, { status: 400 });

      const newBooking = new Booking({ userId: user._id, date, type: "book", seatNumber });
      await newBooking.save();
      return NextResponse.json({ success: true, booking: newBooking });

    } else if (action === "cancel") {
      await Booking.findOneAndDelete({ userId: user._id, date });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
