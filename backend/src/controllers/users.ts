import { Request, Response } from 'express';
import { prisma } from '../index';

export const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                role: true,
                kyc_status: true,
                location: true,
                created_at: true
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const submitKyc = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;

        // In a real app, integrate with Stripe Identity here
        // For this MVP, we will mock approve it immediately or set to pending based on mock logic.

        const user = await prisma.user.update({
            where: { id: userId },
            data: { kyc_status: 'APPROVED' }, // Mocking auto-approval
            select: { id: true, kyc_status: true }
        });

        res.json({ message: 'KYC submitted and approved', status: user.kyc_status });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
