import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding dummy data...');

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash('password123', salt);

    // Create Admin
    await prisma.user.create({
        data: {
            email: 'admin@attaris.com',
            password_hash,
            role: 'ADMIN',
            kyc_status: 'APPROVED'
        }
    });

    // Create Hosts
    const hosts = [];
    for (let i = 1; i <= 10; i++) {
        const host = await prisma.user.create({
            data: {
                email: `host${i}@example.com`,
                password_hash,
                role: 'HOST',
                kyc_status: 'APPROVED',
                location: 'Los Angeles'
            }
        });
        hosts.push(host);
    }

    // Create Guests
    for (let i = 1; i <= 40; i++) {
        await prisma.user.create({
            data: {
                email: `guest${i}@example.com`,
                password_hash,
                role: 'GUEST',
                kyc_status: 'APPROVED'
            }
        });
    }

    // Create Cars
    const cities = ['Los Angeles', 'Miami', 'New York', 'Austin', 'San Diego'];
    const carModels = ['Tesla Model 3', 'BMW 3 Series', 'Audi A4', 'Honda Civic', 'Ford Mustang', 'Porsche 911'];

    for (let i = 1; i <= 30; i++) {
        const host = hosts[i % 10];
        const city = cities[i % 5];
        const model = carModels[i % 6];

        await prisma.car.create({
            data: {
                host_id: host.id,
                title: `202${i % 4} ${model}`,
                description: `Experience the thrill of driving this ${model} in ${city}.`,
                price_per_day: 50 + (i * 5),
                location: city,
                specs: JSON.stringify({ seats: 5, doors: 4, type: i % 2 === 0 ? 'Electric' : 'Gas' }),
                availability: true,
                images: JSON.stringify(['https://images.unsplash.com/photo-1549317661-bd32c8e3ef44?auto=format&fit=crop&q=80&w=800'])
            }
        });
    }

    console.log('Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
