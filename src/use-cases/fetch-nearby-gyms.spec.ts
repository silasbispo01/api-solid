import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: '',
      latitude: new Decimal(-13.0025568),
      longitude: new Decimal(-38.4585781),
      phone: '',
    })

    await gymsRepository.create({
      title: 'Far Gym',
      description: '',
      latitude: new Decimal(-27.0610928),
      longitude: new Decimal(-49.5229501),
      phone: '',
    })

    const { gyms } = await sut.execute({
      userLatitude: -13.0025568,
      userLongitude: -38.4585781,
    })

    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
