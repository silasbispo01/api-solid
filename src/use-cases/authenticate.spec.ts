import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from '@/use-cases/register'
import { compare, hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { AutheticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AutheticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AutheticateUseCase(usersRepository)
  })

  it('should be able to authenticate', async () => {
    const email = 'johndoe@example.com'

    await usersRepository.create({
      email,
      name: 'John',
      password_hash: await hash('password', 6),
    })

    const { user } = await sut.execute({
      email,
      password: 'password',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not authenticate with wrong email', async () => {
    const email = 'johndoe@example.com'

    await usersRepository.create({
      email,
      name: 'John',
      password_hash: await hash('password', 6),
    })

    await expect(() =>
      sut.execute({
        email: 'doe@example.com',
        password: 'password',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not authenticate with wrong password', async () => {
    const email = 'johndoe@example.com'

    await usersRepository.create({
      email,
      name: 'John',
      password_hash: await hash('password', 6),
    })

    await expect(() =>
      sut.execute({
        email,
        password: 'wrong_password',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
