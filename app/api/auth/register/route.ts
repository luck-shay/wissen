import { NextRequest, NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";
import * as argon2 from "argon2";
import User from "@/models/User";
import "@/lib/db";
import { createAuthCookie } from "@/lib/api-utils";
import { getBatchForSquad, getSquadDefaultSeatRange } from "@/lib/squads";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, squad } = await req.json();
    if (!email || !password || !squad) {
      return NextResponse.json(
        { error: "Email, password, and squad are required" },
        { status: StatusCodes.BAD_REQUEST },
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: StatusCodes.BAD_REQUEST },
      );
    }

    const parsedSquad = parseInt(squad, 10);
    if (isNaN(parsedSquad) || parsedSquad < 1 || parsedSquad > 10) {
      return NextResponse.json(
        { error: "Invalid squad selected" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const batch = getBatchForSquad(parsedSquad);
    const seatRange = getSquadDefaultSeatRange(parsedSquad);
    
    // We assign a default seat by checking how many members currently exist in this squad
    const membersInSquad = await User.countDocuments({ squad: parsedSquad });
    if (membersInSquad >= 8) {
      return NextResponse.json({ error: "Squad is full!" }, { status: StatusCodes.BAD_REQUEST });
    }

    const defaultSeat = (seatRange?.start || 1) + membersInSquad;

    const hashedPassword = await argon2.hash(password);
    const user = await User.create({
      name: name || email,
      email,
      password: hashedPassword,
      squad: parsedSquad,
      batch,
      defaultSeat
    });

    const response = NextResponse.json(
      { user: { id: user._id, email: user.email, name: user.name, squad: user.squad, batch: user.batch, defaultSeat: user.defaultSeat } },
      { status: StatusCodes.CREATED },
    );
    await createAuthCookie(response, user);
    return response;
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    );
  }
}
