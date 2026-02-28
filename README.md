# Attaris Drive Cap

A fully functional, two-sided peer-to-peer car sharing marketplace (MVP).

## Overview
This platform allows Hosts to list vehicles and Guests to book them, similar to Turo. The project is separated into three main parts:
1. **Backend API**: Node.js, Express, TypeScript, Prisma (SQLite for local testing).
2. **Admin Dashboard**: React (Vite) and TailwindCSS.
3. **Mobile App**: React Native (Expo) supporting both Guest and Host flows.

## Architecture & Tech Stack
- **Backend:** Node.js, Express, TypeScript, Prisma ORM, SQLite DB.
- **Admin Web UI:** React, Vite, Tailwind CSS, Axios, Lucide Icons.
- **Mobile UI:** React Native (Expo), React Navigation, AsyncStorage, Axios.

---

## Dummy Data & Test Accounts
A seed script successfully initialized dummy data (Hosts, Cars, Bookings, Users):

**Admin Login:**
- **Email:** admin@attaris.com
- **Password:** password123

**Host Login (Example):**
- **Email:** host1@example.com (Up to host10)
- **Password:** password123

**Guest Login (Example):**
- **Email:** guest1@example.com (Up to guest40)
- **Password:** password123

---

## Setup & Running Instructions

### 1. Backend API
1. Open a terminal and navigate to `AttarisDriveCap/backend`.
2. Run `npm install` (dependencies should already be installed).
3. Ensure `.env` exists with `DATABASE_URL="file:./dev.db"`.
4. Run `npm run seed` (if database doesn't exist already) to seed dummy data.
5. Run `npm run dev` to start the Node server on `http://localhost:5000`.

### 2. Admin Dashboard
1. Open a new terminal and navigate to `AttarisDriveCap/admin`.
2. Run `npm install` (should be done already).
3. Run `npm run dev` to start the web dashboard.
4. Access at `http://localhost:5173/`.
5. Login with `admin@attaris.com` / `password123`.

### 3. Mobile App (Guest & Host)
1. Open a new terminal and navigate to `AttarisDriveCap/mobile`.
2. Run `npm install` (should be done already).
3. Open `src/api.ts` and change the `baseURL` IP address (`http://192.168.1.100:5000/api`) to your actual computer's local network IP if testing on a physical device, or `http://10.0.2.2:5000/api` for Android Emulator.
4. Run `npx expo start` or `npm start`.
5. Scan the QR code using the Expo Go app on iOS/Android, or press `a` to open Android emulator.
6. Login using guest or host credentials above to navigate the respective flows.

---

## Completed Features
- JWT Auth & Role-Based Access Control
- Prisma ORM Data modeling (Cars, Users, Bookings)
- Auto-calculate Pricing (Days * DailyRate + 10% Service + 5% Fee)
- Overlapping booking detection logic
- Admin Dashboard Analytics, Fleet management, User management
- React Native Mobile Navigation (Login -> Guest vs Host Routing)
- Mocked Stripe logic & KYC handling via Admin Approval endpoints

## Future Expansions
- Swap SQLite with PostgreSQL inside `prisma/schema.prisma` and `.env`.
- Integrate actual Google Maps SDK inside Expo.
- Add real Stripe API Webhook logic inside Backend.
