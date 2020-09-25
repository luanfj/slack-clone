import { uuid } from 'uuidv4'

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository'

import UserToken from '@modules/users/infra/typeorm/entities/UserToken'

class FakeUserTokensRepository implements IUserTokensRepository {
  private userTokens: UserToken[] = []

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken()

    Object.assign(userToken, {
      id: uuid(),
      token: uuid(),
      valid: true,
      user_id,
      created_at: new Date(),
      updated_at: new Date()
    })

    this.userTokens.push(userToken)

    return userToken
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = this.userTokens.find(
      findToken => findToken.token === token
    )

    return userToken
  }

  public async expireToken(token: string): Promise<UserToken> {
    const findIndex = this.userTokens.findIndex(
      findToken => findToken.token === token
    )

    this.userTokens[findIndex].valid = false

    return this.userTokens[findIndex]
  }
}

export default FakeUserTokensRepository
