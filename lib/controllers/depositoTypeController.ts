import { prisma } from '@/lib/prisma'

export const depositoTypeController = {
  async getAll() {
    return await prisma.depositoType.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
  },

  async getById(id: number) {
    return await prisma.depositoType.findUnique({
      where: { id }
    })
  },

  async create(data: { name: string; yearlyReturn: number }) {
    return await prisma.depositoType.create({
      data
    })
  },

  async update(id: number, data: { name?: string; yearlyReturn?: number }) {
    return await prisma.depositoType.update({
      where: { id },
      data
    })
  },

  async delete(id: number) {
    return await prisma.depositoType.delete({
      where: { id }
    })
  }
}
