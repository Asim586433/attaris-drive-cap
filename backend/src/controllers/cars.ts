import { Request, Response } from 'express';
import { prisma } from '../index';

export const getCars = async (req: Request, res: Response) => {
    try {
        const { location, maxPrice } = req.query;

        const whereClause: any = { availability: true };
        if (location) {
            whereClause.location = { contains: String(location) };
        }
        if (maxPrice) {
            whereClause.price_per_day = { lte: parseFloat(String(maxPrice)) };
        }

        const cars = await prisma.car.findMany({
            where: whereClause,
            include: {
                host: { select: { id: true, email: true, kyc_status: true } }
            }
        });

        res.json(cars);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const getCarById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const car = await prisma.car.findUnique({
            where: { id },
            include: { host: { select: { id: true, email: true } }, bookings: true }
        });

        if (!car) {
            return res.status(404).json({ error: 'Car not found' });
        }

        res.json(car);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const addCar = async (req: Request, res: Response) => {
    try {
        const hostId = (req as any).user.id;
        const { title, description, price_per_day, location, specs, availability, images } = req.body;

        const car = await prisma.car.create({
            data: {
                host_id: hostId,
                title,
                description,
                price_per_day,
                location,
                specs: JSON.stringify(specs),
                availability: availability ?? true,
                images: JSON.stringify(images)
            }
        });

        res.status(201).json(car);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const updateCar = async (req: Request, res: Response) => {
    try {
        const hostId = (req as any).user.id;
        const { id } = req.params;
        const updateData = req.body;

        const car = await prisma.car.findUnique({ where: { id } });
        if (!car || car.host_id !== hostId) {
            return res.status(403).json({ error: 'Unauthorized or car not found' });
        }

        if (updateData.specs) updateData.specs = JSON.stringify(updateData.specs);
        if (updateData.images) updateData.images = JSON.stringify(updateData.images);

        const updatedCar = await prisma.car.update({
            where: { id },
            data: updateData
        });

        res.json(updatedCar);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const deleteCar = async (req: Request, res: Response) => {
    try {
        const hostId = (req as any).user.id;
        const { id } = req.params;

        const car = await prisma.car.findUnique({ where: { id } });
        if (!car || car.host_id !== hostId) {
            return res.status(403).json({ error: 'Unauthorized or car not found' });
        }

        await prisma.car.delete({ where: { id } });
        res.json({ message: 'Car deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
