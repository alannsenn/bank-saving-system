import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const depositoTypes = [
    { name: 'Deposito Bronze', yearlyReturn: 0.03 },
    { name: 'Deposito Silver', yearlyReturn: 0.05 },
    { name: 'Deposito Gold', yearlyReturn: 0.07 },
  ]

  for (const depositoType of depositoTypes) {
    await prisma.depositoType.upsert({
      where: { name: depositoType.name },
      update: {},
      create: depositoType,
    })
  }

  console.log('Database seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
