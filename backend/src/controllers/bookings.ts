import { Request, Response } from 'express';
import { prisma } from '../index';

export const createBooking = async (req: Request, res: Response) => {
    try {
        const guestId = (req as any).user.id;
        const { car_id, start_date, end_date } = req.body;

        const car = await prisma.car.findUnique({ where: { id: car_id } });
        if (!car || !car.availability) {
            return res.status(400).json({ error: 'Car not found or unavailable' });
        }

        const start = new Date(start_date);
        const end = new Date(end_date);
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));

        if (days <= 0) {
            return res.status(400).json({ error: 'Invalid date range' });
        }

        // Overlapping booking checking
        const overlapping = await prisma.booking.findFirst({
            where: {
                car_id,
                status: { in: ['PENDING', 'APPROVED', 'ACTIVE'] },
                OR: [
                    { start_date: { lte: end }, end_date: { gte: start } }
                ]
            }
        });

        if (overlapping) {
            return res.status(400).json({ error: 'Car is already booked for these dates' });
        }

        // Pricing calculation
        const basePrice = car.price_per_day * days;
        const serviceFee = basePrice * 0.10;
        const insuranceFee = basePrice * 0.05;
        const total_price = basePrice + serviceFee + insuranceFee;

        const booking = await prisma.booking.create({
            data: {
                car_id,
                guest_id: guestId,
                start_date: start,
                end_date: end,
                total_price,
                status: 'PENDING'
            }
        });

        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const approveBooking = async (req: Request, res: Response) => {
    try {
        const hostId = (req as any).user.id;
        const { id } = req.params;

        const booking = await prisma.booking.findUnique({ where: { id }, include: { car: true } });
        if (!booking || booking.car.host_id !== hostId) {
            return res.status(403).json({ error: 'Unauthorized or booking not found' });
        }

        const updated = await prisma.booking.update({
            where: { id },
            data: { status: 'APPROVED' }
        });

        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const cancelBooking = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { id } = req.params;

        const booking = await prisma.booking.findUnique({ where: { id }, include: { car: true } });
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        if (booking.guest_id !== userId && booking.car.host_id !== userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const updated = await prisma.booking.update({
            where: { id },
            data: { status: 'CANCELLED' }
        });

        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const completeBooking = async (req: Request, res: Response) => {
    // Can be triggered by guest/host or admin
    try {
        const { id } = req.params;

        const booking = await prisma.booking.update({
            where: { id },
            data: { status: 'COMPLETED' }
        });

        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const getBookings = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const role = (req as any).user.role;

        let bookings;
        if (role === 'HOST') {
            bookings = await prisma.booking.findMany({
                where: { car: { host_id: userId } },
                include: { car: true, guest: { select: { id: true, email: true } } }
            });
        } else {
            bookings = await prisma.booking.findMany({
                where: { guest_id: userId },
                include: { car: true }
            });
        }

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
