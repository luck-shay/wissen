# Office Seat Booking System

A **Next.js web app** to manage office seating for **80 employees across 50 seats**, using a rotating **2-week batch schedule**.

---

## Overview

The system organizes office visits by dividing teams into **2 batches**, each following a **fortnightly rotation**. It ensures efficient seat usage through:

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

- Week-wise seat navigation  
- Auto-reserved designated seats  
- Seat release for absentees  
- Booking for floater and released seats  
- **3 PM rule** for advance booking (non-designated users)  
- Same-day booking always allowed  
- Holiday-based booking restrictions  
- One booking per user per day  
- Color-coded seat status UI  

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
