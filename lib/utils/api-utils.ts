import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { serialize } from "cookie";
import { signToken } from "@/lib/jwt";
import { verifyToken } from "@/lib/jwt";

/** Sign a JWT and attach a Set-Cookie header to an existing NextResponse. */
export async function createAuthCookie(
  response: NextResponse,
  user: {
    _id: unknown;
    email: string;
    name: string;
    squad?: number;
    batch?: number;
    defaultSeat?: number;
  },
): Promise<string> {
  const token = await signToken({
    userId: String(user._id),
    email: user.email,
    name: user.name,
    squad: user.squad,
    batch: user.batch,
    defaultSeat: user.defaultSeat,
  });
  response.headers.append(
    "Set-Cookie",
    serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    }),
  );
  return token;
}

export const unauthorized = () =>
  NextResponse.json({ error: "Unauthorized" }, { status: 401 });

export async function getSession() {
  const headersList = await headers();
  let token = headersList.get("authorization")?.split(" ")[1];

  if (!token) {
    const cookies = headersList.get("cookie");
    if (cookies) {
      const cookieStr = cookies
        .split(";")
        .find((c) => c.trim().startsWith("token="));
      if (cookieStr) token = cookieStr.split("=")[1];
    }
  }

  if (!token) return null;

  const decoded = await verifyToken(token);
  if (!decoded || !decoded.userId) return null;

  return {
    user: {
      id: decoded.userId as string,
      email: decoded.email as string,
      name: decoded.name as string,
      squad: decoded.squad as number | undefined,
      batch: decoded.batch as number | undefined,
      defaultSeat: decoded.defaultSeat as number | undefined,
    },
    token,
  };
}
