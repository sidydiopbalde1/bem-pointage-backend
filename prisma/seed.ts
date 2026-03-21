import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  const existing = await prisma.user.findUnique({ where: { email: 'admin@pointage.com' } });

  if (existing) {
    console.log('Admin déjà existant :', existing.email);
    return;
  }

  const password = await bcrypt.hash('Admin@1234', 10);

  const admin = await prisma.user.create({
    data: {
      firstName: 'Super',
      lastName: 'Admin',
      email: 'admin@pointage.com',
      password,
      role: 'ADMIN',
    },
  });

  console.log('Admin créé avec succès :', admin.email);
  console.log('Mot de passe : Admin@1234');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
