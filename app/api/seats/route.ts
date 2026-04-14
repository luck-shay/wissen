import { NextRequest, NextResponse } from "next/server";
import "@/lib/db";
import Booking from "@/models/Booking";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {    
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    
    if (!startDate || !endDate) {
      return NextResponse.json({ error: "startDate and endDate are required" }, { status: 400 });
    }

    const bookings = await Booking.find({
      date: { $gte: startDate, $lte: endDate },
    }).populate("userId", "name email squad batch defaultSeat");

    // Also send back all users so frontend can build the designated roster map easily
    const users = await User.find({}, "name email squad batch defaultSeat");

    return NextResponse.json({ bookings, users }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to fetch seats data" }, { status: 500 });
  }
}
