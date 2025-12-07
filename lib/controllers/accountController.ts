import { prisma } from '@/lib/prisma'

export const accountController = {
  async getAll() {
    return await prisma.account.findMany({
      include: {
        customer: true,
        depositoType: true,
        transactions: {
          orderBy: {
            date: 'desc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  },

  async getById(id: number) {
    return await prisma.account.findUnique({
      where: { id },
      include: {
        customer: true,
        depositoType: true,
        transactions: {
          orderBy: {
            date: 'desc'
          }
        }
      }
    })
  },

  async create(data: { customerId: number; depositoTypeId: number; balance?: number }) {
    return await prisma.account.create({
      data,
      include: {
        customer: true,
        depositoType: true
      }
    })
  },

  async update(id: number, data: { depositoTypeId?: number; balance?: number }) {
    return await prisma.account.update({
      where: { id },
      data,
      include: {
        customer: true,
        depositoType: true
      }
    })
  },

  async delete(id: number) {
    return await prisma.account.delete({
      where: { id }
    })
  },

  async deposit(accountId: number, amount: number, date: Date) {
    const account = await prisma.account.findUnique({
      where: { id: accountId }
    })

    if (!account) {
      throw new Error('Account not found')
    }

    const newBalance = account.balance + amount

    await prisma.transaction.create({
      data: {
        accountId,
        type: 'DEPOSIT',
        amount,
        date
      }
    })

    return await prisma.account.update({
      where: { id: accountId },
      data: {
        balance: newBalance,
        depositDate: account.depositDate || date
      },
      include: {
        customer: true,
        depositoType: true,
        transactions: true
      }
    })
  },

  async withdraw(accountId: number, amount: number, date: Date) {
    const account = await prisma.account.findUnique({
      where: { id: accountId },
      include: {
        depositoType: true
      }
    })

    if (!account) {
      throw new Error('Account not found')
    }

    if (!account.depositDate) {
      throw new Error('No deposit date found for this account')
    }

    const startingBalance = account.balance
    const monthlyReturn = account.depositoType.yearlyReturn / 12
    const months = this.calculateMonthsDifference(account.depositDate, date)
    const endingBalance = startingBalance + (startingBalance * months * monthlyReturn)

    if (amount > endingBalance) {
      throw new Error('Insufficient balance')
    }

    const newBalance = endingBalance - amount

    await prisma.transaction.create({
      data: {
        accountId,
        type: 'WITHDRAW',
        amount,
        date
      }
    })

    return await prisma.account.update({
      where: { id: accountId },
      data: {
        balance: newBalance
      },
      include: {
        customer: true,
        depositoType: true,
        transactions: true
      }
    })
  },

  calculateMonthsDifference(startDate: Date, endDate: Date): number {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
    return Math.max(months, 0)
  },

  calculateEndingBalance(startingBalance: number, yearlyReturn: number, depositDate: Date, withdrawDate: Date): number {
    const monthlyReturn = yearlyReturn / 12
    const months = this.calculateMonthsDifference(depositDate, withdrawDate)
    return startingBalance + (startingBalance * months * monthlyReturn)
  }
}
