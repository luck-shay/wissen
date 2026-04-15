# Office Seat Booking System

A Next.js web app to manage office seating for 80 employees across 50 seats, using a rotating 2-week batch schedule.

---

## Overview

Teams visit the office on a rotating fortnightly schedule. The system enforces designated seating, handles vacation releases, and gates floater and non-designated bookings behind a daily 10 AM cutoff.

- Automatic designated seat allocation
- Controlled booking for non-designated users
- Seat release handling
- Holiday-aware scheduling

---

## Seat Distribution

| Seats | Type | Description |
|---|---|---|
| 1 - 40 | Designated | Fixed seats assigned to squads |
| 41 - 50 | Floater | Open for flexible booking |

- 10 squads total
- 8 members per squad
- Squads 1-5 -> Batch 1
- Squads 6-10 -> Batch 2

---

## Schedule Logic

| Week Type | Batch 1 | Batch 2 |
|---|---|---|
| Odd Week | Mon - Wed | Thu - Fri |
| Even Week | Thu - Fri | Mon - Wed |

---

## Features

- Week-wise seat view: browse any week using the navigation arrows
- Designated seat: automatically reserved; owner can vacate if not coming in
- Seat release: vacated seats become bookable by non-designated users
- Floater seats: bookable by non-designated users after 10 AM the prior work day
- Same-day booking: always allowed (no 10 AM restriction)
- Holiday blocking: booking is disabled on public holidays; days are flagged in the UI
- One booking per day: once a non-designated user books any seat, all other Book buttons disappear
- Color-coded grid: green (your seat), orange (you vacated), sky (vacated by owner), blue (floater), gray (occupied), dimmed (locked until 10 AM)
- Context banner: tells you whether it is your designated day or when you can book

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js |
| Language | TypeScript |
| Database | MongoDB (Mongoose) |
| Auth | JWT + HTTP-only cookies |
| Styling | Tailwind CSS + shadcn/ui |
| State | Zustand |
| Forms | React Hook Form + Zod |

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- MongoDB instance

### Setup

```bash
pnpm install
cp .env.local.example .env.local
pnpm dev
```

Open http://localhost:3000.

### Environment Variables

| Variable | Description |
|---|---|
| MONGO_URI | MongoDB connection string |
| JWT_SECRET | Secret used to sign auth tokens |

---

## Project Structure

```text
app/
  api/
    auth/          # login, logout, register, /me
    seats/
      route.ts     # GET week allocations
      actions/     # POST book / release / cancel
  login/
  register/
  page.tsx         # Main seat grid page
components/
  seats/
    types.ts       # Shared types, status styles, legend
    WeekNav.tsx    # Week header + prev/next
    DayTabs.tsx    # Day picker with holiday/batch labels
    ContextBanner.tsx  # Designated / non-designated info
    SeatCard.tsx   # Individual seat card + action buttons
    SeatGrid.tsx   # Squad blocks + floater section
hooks/
  useRequireAuth.ts
lib/
  api-utils.ts     # Shared API helpers
  dateUtils.ts     # Holiday list, batch schedule logic, 10 AM rule
  squads.ts        # Squad -> batch + seat range helpers
  db.ts            # Mongoose connection
  jwt.ts           # Token sign/verify
models/
  User.ts
  Booking.ts
store/
  useAuthStore.ts  # Zustand auth store
```

---

## Business Rules

1. Designated day: a user's batch is in-office. Their seat is auto-occupied; they can release it.
2. Non-designated day: user can book a released designated seat or a floater seat, but only after 10 AM of the prior work day (bypassed on the same day, and in development mode).
3. Holidays: no bookings of any kind; all action buttons are hidden and the grid is replaced with a holiday message.
4. One seat per day: a non-designated user cannot book more than one seat on the same day.
5. Cancel: any booking (release or book) can be cancelled by the user who made it.

---

## Available Scripts

| Command | Description |
|---|---|
| pnpm dev | Start development server |
| pnpm build | Production build |
| pnpm start | Start production server |
| pnpm lint | Run ESLint |
# Office Seat Booking System

A **Next.js web app** to manage office seating for **80 employees across 50 seats**, using a rotating **2-week batch schedule**.

---

## Overview

<<<<<<< HEAD
The system organizes office visits by dividing teams into **2 batches**, each following a **fortnightly rotation**. It ensures efficient seat usage through:
=======
Teams visit the office on a rotating fortnightly schedule. The system enforces designated seating, handles vacation releases, and gates floater/non-designated bookings behind a daily 10 AM cutoff.
>>>>>>> a155a91 (Update booking rules to change non-designated seat booking window from 3 PM to 10 AM)

- Automatic designated seat allocation  
- Controlled booking for non-designated users  
- Seat release handling  
- Holiday-aware scheduling  

---

## Seat Distribution

| Seats | Type | Description |
|------|------|------------|
| 1 – 40 | Designated | Fixed seats assigned to squads |
| 41 – 50 | Floater | Open for flexible booking |

- 10 squads total  
- 8 members per squad  
- Squads 1–5 → Batch 1  
- Squads 6–10 → Batch 2  

---

## Schedule Logic

| Week Type | Batch 1 | Batch 2 |
|----------|--------|--------|
| Odd Week | Mon – Wed | Thu – Fri |
| Even Week | Thu – Fri | Mon – Wed |

---

## Features

<<<<<<< HEAD
- Week-wise seat navigation  
- Auto-reserved designated seats  
- Seat release for absentees  
- Booking for floater and released seats  
- **3 PM rule** for advance booking (non-designated users)  
- Same-day booking always allowed  
- Holiday-based booking restrictions  
- One booking per user per day  
- Color-coded seat status UI  
=======
- **Week-wise seat view** — browse any week using the navigation arrows
- **Designated seat** — automatically reserved; owner can vacate if not coming in
- **Seat release** — vacated seats become bookable by non-designated users
- **Floater seats** — bookable by non-designated users after 10 AM the prior work day
- **Same-day booking** — always allowed (no 10 AM restriction)
- **Holiday blocking** — booking is disabled on public holidays; days are flagged in the UI
- **One booking per day** — once a non-designated user books any seat, all other Book buttons disappear
- **Color-coded grid** — green (your seat), orange (you vacated), sky (vacated by owner), blue (floater), gray (occupied), dimmed (locked until 10 AM)
- **Context banner** — tells you whether it's your designated day or when you can book
>>>>>>> a155a91 (Update booking rules to change non-designated seat booking window from 3 PM to 10 AM)

---

## Tech Stack

| Layer | Technology |
|------|-----------|
| Framework | Next.js |
| Language | TypeScript |
| Database | MongoDB (Mongoose) |
| Auth | JWT + HTTP-only cookies |
| Styling | Tailwind CSS + shadcn/ui |
| State | Zustand |
| Forms | React Hook Form + Zod |

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- MongoDB instance

### Setup

```bash
pnpm install
cp .env.local.example .env.local
pnpm dev
<<<<<<< HEAD
=======
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign auth tokens |

---

## Project Structure

```
app/
  api/
    auth/          # login, logout, register, /me
    seats/
      route.ts     # GET week allocations
      actions/     # POST book / release / cancel
  login/
  register/
  page.tsx         # Main seat grid page
components/
  seats/
    types.ts       # Shared types, status styles, legend
    WeekNav.tsx    # Week header + prev/next
    DayTabs.tsx    # Day picker with holiday/batch labels
    ContextBanner.tsx  # Designated / non-designated info
    SeatCard.tsx   # Individual seat card + action buttons
    SeatGrid.tsx   # Squad blocks + floater section
hooks/
  useRequireAuth.ts
lib/
  api-utils.ts     # Shared API helpers
  dateUtils.ts     # Holiday list, batch schedule logic, 10 AM rule
  squads.ts        # Squad → batch + seat range helpers
  db.ts            # Mongoose connection
  jwt.ts           # Token sign/verify
models/
  User.ts
  Booking.ts
store/
  useAuthStore.ts  # Zustand auth store
```

---

## Business Rules

1. **Designated day** — a user's batch is in-office. Their seat is auto-occupied; they can release it.
2. **Non-designated day** — user can book a released designated seat or a floater seat, but only after 10 AM of the prior work day (bypassed on the same day, and in `development` mode).
3. **Holidays** — no bookings of any kind; all action buttons are hidden and the grid is replaced with a holiday message.
4. **One seat per day** — a non-designated user cannot book more than one seat on the same day.
5. **Cancel** — any booking (release or book) can be cancelled by the user who made it.

---

## Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
>>>>>>> a155a91 (Update booking rules to change non-designated seat booking window from 3 PM to 10 AM)
