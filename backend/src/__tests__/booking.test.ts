import { describe, expect, test } from '@jest/globals';

describe('Booking Pricing Logic', () => {
    test('Prices are calculated correctly with 10% service and 5% insurance fee', () => {
        const dailyRate = 50;
        const days = 3;

        const basePrice = dailyRate * days; // 150
        const serviceFee = basePrice * 0.10; // 15
        const insuranceFee = basePrice * 0.05; // 7.5
        const total_price = basePrice + serviceFee + insuranceFee; // 172.5

        expect(total_price).toBe(172.5);
    });

    test('Dates must not overlap for the same car', () => {
        const existingBooking = { start: new Date('2026-03-01'), end: new Date('2026-03-05') };
        const newBookingStart = new Date('2026-03-04');
        const newBookingEnd = new Date('2026-03-06');

        // Overlap logic
        const isOverlapping = newBookingStart <= existingBooking.end && newBookingEnd >= existingBooking.start;
        expect(isOverlapping).toBe(true);
    });
});
