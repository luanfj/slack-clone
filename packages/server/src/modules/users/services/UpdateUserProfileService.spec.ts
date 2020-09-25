import AppError from '@shared/errors/AppError'

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import UpdateUserProfileService from './UpdateUserProfileService'

let fakeUsersRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider
let updateUserProfile: UpdateUserProfileService

describe('UpdateUserProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()

    updateUserProfile = new UpdateUserProfileService(
      fakeUsersRepository,
      fakeHashProvider
    )
  })

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'any@test.com',
      password: '123'
    })

    const updatedUser = await updateUserProfile.execute({
      user_id: user.id,
      name: 'Test',
      email: 'any@email.com'
    })

    expect(updatedUser.name).toBe('Test')
    expect(updatedUser.email).toBe('any@email.com')
  })

  it('should not be able to update an inexistent profile', async () => {
    expect(
      updateUserProfile.execute({
        user_id: 'nothing',
        name: 'Test',
        email: 'any@email.com'
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should be able to change with an existent email', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'any@test.com',
      password: '123'
    })

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'any@email.com',
      password: '123'
    })

    await expect(
      updateUserProfile.execute({
        user_id: user.id,
        name: 'Test',
        email: 'any@test.com'
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'any@test.com',
      password: '123'
    })

    const updatedUser = await updateUserProfile.execute({
      user_id: user.id,
      name: 'Test',
      email: 'any@email.com',
      old_password: '123',
      password: '1234'
    })

    expect(updatedUser.password).toBe('1234')
  })

  it('should be not able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'any@test.com',
      password: '123'
    })

    await expect(
      updateUserProfile.execute({
        user_id: user.id,
        name: 'Test',
        email: 'any@email.com',
        password: '1234'
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should be not able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'any@test.com',
      password: '123'
    })

    await expect(
      updateUserProfile.execute({
        user_id: user.id,
        name: 'Test',
        email: 'any@test.com',
        old_password: 'wrong-old-password',
        password: '1234'
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should be not able to update the password with same old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'any@test.com',
      password: '123'
    })

    await expect(
      updateUserProfile.execute({
        user_id: user.id,
        name: 'Test',
        email: 'any@test.com',
        old_password: '123',
        password: '123'
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
