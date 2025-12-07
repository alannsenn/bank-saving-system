# Bank Saving System - Deployment Guide

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Set up the database:
```bash
npx prisma migrate dev
npx prisma db seed
```

3. Start the development server:
```bash
npm run dev
```

4. Open http://localhost:3000 in your browser

## Production Deployment (Vercel - Free)

### Prerequisites
- GitHub account
- Vercel account (free at vercel.com)

### Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to https://vercel.com
   - Sign in with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js
   - Click "Deploy"

3. **Database Setup for Production**

   For SQLite (current setup):
   - SQLite works for development but not recommended for production on Vercel
   - Consider upgrading to Vercel Postgres (free tier available)

   To use Vercel Postgres:
   - In Vercel project dashboard, go to "Storage" tab
   - Create a new Postgres database
   - Copy the connection string
   - Add to your project's Environment Variables:
     - Key: `DATABASE_URL`
     - Value: <postgres-connection-string>
   - Update `prisma/schema.prisma`:
     ```prisma
     datasource db {
       provider = "postgresql"
       url      = env("DATABASE_URL")
     }
     ```
   - Redeploy the application

4. **Run Migrations in Production**
   - In your project settings, add build command:
     ```bash
     npx prisma migrate deploy && npx prisma db seed && next build
     ```

## Features

- **Customer Management**: Create, edit, delete customers
- **Account Management**: Create accounts with different deposito types
- **Deposito Types**: Bronze (3%), Silver (5%), Gold (7%) yearly return
- **Transactions**: Deposit and withdraw with date tracking
- **Balance Calculation**: Automatic ending balance calculation on withdrawal

## System Requirements

- Node.js 18+ (for local development)
- Modern web browser

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Prisma ORM
- SQLite (development) / PostgreSQL (production recommended)
- Tailwind CSS
