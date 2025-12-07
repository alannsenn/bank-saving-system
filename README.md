# Bank Saving System

A full-stack bank saving system built with Next.js, featuring customer management, account management, and deposito type management with interest calculations.

## Features

- **Customer Management**: CRUD operations for customers
- **Account Management**: Create accounts with different deposito types
- **Deposito Types**: Pre-seeded with Bronze (3%), Silver (5%), and Gold (7%) yearly returns
- **Deposit & Withdraw**: Track transactions with dates
- **Balance Calculation**: Automatic ending balance calculation based on deposit date and withdrawal date
- **MVC Architecture**: Clean separation of concerns with Models, Views, and Controllers

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MVC Controllers
- **Database**: SQLite (development), Prisma ORM
- **Deployment**: Vercel (recommended)

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up database:**
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   Navigate to http://localhost:3000

## Project Structure

```
bank-saving-system/
├── app/
│   ├── api/                  # API routes (Controllers)
│   ├── customers/            # Customer pages
│   ├── accounts/             # Account pages
│   ├── deposito-types/       # Deposito type pages
│   └── layout.tsx            # Root layout with navigation
├── lib/
│   ├── controllers/          # Business logic (MVC Controllers)
│   └── prisma.ts             # Prisma client
├── prisma/
│   ├── schema.prisma         # Database schema (Models)
│   ├── seed.ts               # Database seeder
│   └── migrations/           # Database migrations
└── DEPLOYMENT.md             # Deployment instructions
```

## Business Logic

### Account Balance Calculation

When a customer withdraws money, the system calculates the ending balance using:

```
ending balance = starting balance * #months * monthly return
monthly return = yearly return / 12
```

Where:
- `starting balance`: Current account balance
- `#months`: Number of months between deposit date and withdrawal date
- `yearly return`: Interest rate from deposito type (e.g., 0.03 for 3%)

## License

MIT
