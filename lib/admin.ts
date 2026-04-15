import * as argon2 from "argon2";
import User from "@/models/User";

export const ADMIN_EMAIL = "admin@wissen.com";
export const ADMIN_PASSWORD = "Admin123";

export async function ensureAdminUserExists() {
  const existing = await User.findOne({ email: ADMIN_EMAIL });

  if (!existing) {
    const hashedPassword = await argon2.hash(ADMIN_PASSWORD);
    await User.create({
      name: "Admin",
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin",
      squad: 0,
      batch: 0,
      defaultSeat: 0,
    });
    return;
  }

  const passwordMatches = await argon2.verify(existing.password, ADMIN_PASSWORD);
  if (existing.role !== "admin" || !passwordMatches) {
    const hashedPassword = await argon2.hash(ADMIN_PASSWORD);
    existing.name = "Admin";
    existing.role = "admin";
    existing.password = hashedPassword;
    existing.squad = 0;
    existing.batch = 0;
    existing.defaultSeat = 0;
    await existing.save();
  }
}
