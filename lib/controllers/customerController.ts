import { prisma } from '@/lib/prisma'

export const customerController = {
  async getAll() {
    return await prisma.customer.findMany({
      include: {
        accounts: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  },

  async getById(id: number) {
    return await prisma.customer.findUnique({
      where: { id },
      include: {
        accounts: {
          include: {
            depositoType: true
          }
        }
      }
    })
  },

  async create(data: { name: string }) {
    return await prisma.customer.create({
      data
    })
  },

  async update(id: number, data: { name: string }) {
    return await prisma.customer.update({
      where: { id },
      data
    })
  },

  async delete(id: number) {
    return await prisma.customer.delete({
      where: { id }
    })
  }
}
