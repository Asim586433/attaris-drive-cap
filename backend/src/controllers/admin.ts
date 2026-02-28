import { Request, Response } from 'express';
import { prisma } from '../index';

export const getAnalytics = async (req: Request, res: Response) => {
    try {
        const totalUsers = await prisma.user.count();
        const totalCars = await prisma.car.count();
        const totalBookings = await prisma.booking.count();

        const completedBookings = await prisma.booking.findMany({
            where: { status: 'COMPLETED' },
            select: { total_price: true }
        });

        const revenue = completedBookings.reduce((sum: number, b: { total_price: number }) => sum + (b.total_price * 0.10), 0); // 10% platform fee

        res.json({
            totalUsers,
            totalCars,
            totalBookings,
            revenue
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, email: true, role: true, kyc_status: true, created_at: true }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const suspendUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        // For MVP, we'll use a hack or add a field if we had suspended. Since we don't have suspended column, let's update role to SUSPENDED.
        const user = await prisma.user.update({
            where: { id },
            data: { role: 'SUSPENDED' }
        });
        res.json({ message: 'User suspended', user });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const approveUserKyc = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.update({
            where: { id },
            data: { kyc_status: 'APPROVED' }
        });
        res.json({ message: 'User KYC Approved', user });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const getAdminCars = async (req: Request, res: Response) => {
    try {
        const cars = await prisma.car.findMany({
            include: { host: { select: { id: true, email: true } } }
        });
        res.json(cars);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
