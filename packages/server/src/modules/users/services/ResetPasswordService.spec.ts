import AppError from '@shared/errors/AppError'

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import ResetPasswordService from './ResetPasswordService'
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'

let fakeUsersRepository: FakeUsersRepository
let fakeUserTokensRepository: FakeUserTokensRepository
let resetPassword: ResetPasswordService
let fakeHashProvider: FakeHashProvider

describe('ResetPassword', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeUserTokensRepository = new FakeUserTokensRepository()
    fakeHashProvider = new FakeHashProvider()

    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider
    )
  })

  it('should be able to reset the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'test',
      email: 'any@test.com',
      password: '123'
    })

    const { token } = await fakeUserTokensRepository.generate(user.id)

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash')

    await resetPassword.execute({
      password: 'anypass123',
      token
    })

    const updatedUser = await fakeUsersRepository.findById(user.id)

    expect(generateHash).toHaveBeenCalledWith('anypass123')
    expect(updatedUser?.password).toBe('anypass123')
  })

  it('should not be able to reset the password with invalid status token', async () => {
    const user = await fakeUsersRepository.create({
      name: 'test',
      email: 'any@test.com',
      password: '123'
    })

    const { token } = await fakeUserTokensRepository.generate(user.id)

    await fakeUserTokensRepository.expireToken(token)

    await expect(
      resetPassword.execute({
        password: 'anypass123',
        token
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to reset the password with non-existing token', async () => {
    await expect(
      resetPassword.execute({
        token: 'non-existing',
        password: 'a'
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to reset the password with non-existing user', async () => {
    const { token } = await fakeUserTokensRepository.generate(
      'non-existing-user'
    )

    await expect(
      resetPassword.execute({
        token,
        password: 'a'
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to reset the password if passed more than 2 hours', async () => {
    const user = await fakeUsersRepository.create({
      name: 'test',
      email: 'any@test.com',
      password: '123'
    })

    const { token } = await fakeUserTokensRepository.generate(user.id)

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date()

      return customDate.setHours(customDate.getHours() + 3)
    })

    await expect(
      resetPassword.execute({
        password: 'anypass123',
        token
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
