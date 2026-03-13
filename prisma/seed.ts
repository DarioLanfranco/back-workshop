import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.SUPERADMIN_EMAIL;
  const pass = process.env.SUPERADMIN_PASSWORD;

  if (!email || !pass) {
    throw new Error(
      '❌ Error: not SUPERADMIN_EMAIL o SUPERADMIN_PASSWORD in the .env',
    );
  }

  const hashedPassword = await bcrypt.hash(pass, 10);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email: email,
      name: 'Dario',
      lastname: 'Ruffener',
      username: 'ruffener_superadmin',
      password: hashedPassword,
      role: Role.SUPERADMIN,
    },
  });
}

main()
  .catch((e) => {
    console.error('❌ Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
