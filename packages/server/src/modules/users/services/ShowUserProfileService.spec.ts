import AppError from '@shared/errors/AppError'

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import ShowUserProfileService from './ShowUserProfileService'

let fakeUsersRepository: FakeUsersRepository
let showUserProfile: ShowUserProfileService

describe('ShowUserProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()

    showUserProfile = new ShowUserProfileService(fakeUsersRepository)
  })

  it('should be able to show the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'any@test.com',
      password: '123'
    })

    const profile = await showUserProfile.execute({
      user_id: user.id
    })

    expect(profile.name).toBe('John Doe')
    expect(profile.email).toBe('any@test.com')
  })

  it('should not be able to show an inexistent profile', async () => {
    expect(
      showUserProfile.execute({
        user_id: 'nothing'
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
