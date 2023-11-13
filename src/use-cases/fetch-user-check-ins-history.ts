import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { CheckIn } from '@prisma/client'

interface FetchUserCheckinsHistoryUseCaseRequest {
  userId: string
  page: number
}

interface FetchUserCheckinsHistoryUseCaseResponse {
  checkIns: CheckIn[]
}

export class FetchUserCheckinsHistoryUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
    page,
  }: FetchUserCheckinsHistoryUseCaseRequest): Promise<FetchUserCheckinsHistoryUseCaseResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page,
    )

    return {
      checkIns,
    }
  }
}
