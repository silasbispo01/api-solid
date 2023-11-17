import { prisma } from '@/lib/prisma'
import { CheckIn, Prisma } from '@prisma/client'
import dayjs from 'dayjs'
import { CheckInsRepository } from '../check-ins-repository'

export class PrismaCheckInsRepository implements CheckInsRepository {
  async findById(id: string) {
    return await prisma.checkIn.findUnique({ where: { id } })
  }

  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    return await prisma.checkIn.create({
      data,
    })
  }

  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    return await prisma.checkIn.findMany({
      where: { user_id: userId },
      take: 20,
      skip: (page - 1) * 20,
    })
  }

  async countByUserId(userId: string): Promise<number> {
    return await prisma.checkIn.count({
      where: { user_id: userId },
    })
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    return await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: dayjs(date).startOf('date').toDate(),
          lte: dayjs(date).endOf('date').toDate(),
        },
      },
    })
  }

  async save(checkIn: CheckIn): Promise<CheckIn> {
    return await prisma.checkIn.update({
      data: checkIn,
      where: { id: checkIn.id },
    })
  }
}
