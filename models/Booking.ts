import { Schema, Document, Types, models, model } from "mongoose";

export interface IBooking {
  userId?: Types.ObjectId;
  date: string; // YYYY-MM-DD
  seatNumber?: number; // 1 to 50
  type: "release" | "book" | "holiday";
}

export interface IBookingDocument extends IBooking, Document {
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBookingDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    date: { type: String, required: true },
    seatNumber: { type: Number },
    type: { type: String, enum: ["release", "book", "holiday"], required: true },
  },
  { timestamps: true }
);

const Booking = models.Booking ?? model<IBookingDocument>("Booking", BookingSchema);

export default Booking;
