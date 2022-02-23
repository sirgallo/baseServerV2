import { randomUUID } from 'crypto'

import { EncryptProvider } from '@core/auth/providers/EncryptProvider'
import { JwtProvider, TIMESPAN } from '@core/auth/providers/JwtProvider'
import { cryptoOptions } from '@core/crypto/CryptoOptions'
import { GatewayMongooseProvider } from '@gateway/providers/GatewayMongooseProvider'
import { IUser } from '@db/models/Gateway'
import { LogProvider } from '@core/providers/LogProvider'

const NAME = 'Auth Provider'

export class AuthProvider {
  name = NAME
  private log: LogProvider = new LogProvider(NAME)
  private crypt: EncryptProvider = new EncryptProvider()
  private jwt: JwtProvider = new JwtProvider()
  constructor(private mongoDb: GatewayMongooseProvider) {}

  async authenticate(user: Partial<IUser>) {
    try {
      const conn = await this.mongoDb.createNewConnection()
      const connModels = this.mongoDb.singleConnection(conn)
      const currUserEntry = await connModels.MUser.findOne({ email: user.email })
      this.log.info(`Got Use with Id: ${currUserEntry.id}`)
      if(await this.crypt.compare(user.password, currUserEntry.password)) {
        const jwToken = await this.jwt.sign(currUserEntry.id)
        const accessUser = await connModels.MToken.findOne({ userId: currUserEntry.id})
        if (! accessUser) {
          const newAccessToken = new connModels.MToken({
            userId: currUserEntry.id,
            token: jwToken,
            issueDate: new Date().toISOString(),
            expiresIn: TIMESPAN
          })

          const resp = await connModels.MToken.create(newAccessToken)
          this.log.success(`New Token added with User Id: ${resp.userId}`)
        } else if (accessUser) {
          await connModels.MToken.updateOne({
            userId: currUserEntry.id,
            token: jwToken,
            issueDate: new Date().toISOString()
          })

          this.log.success(`Token updated with User Id: ${currUserEntry.id}`)
        } else {
          return new Error('Unknown error trying to find MToken entry.')
        }

        await conn.close()
        
        return { status: 'User Login Success', token: jwToken }
      } else {
        return new Error('Passwords do not match.')
      }
    } catch (err) {
      this.log.getFileSystem().error(err)
      throw err
    }
  }

  async register(newUser: Partial<IUser>): Promise<string> {
    try {
      const conn = await this.mongoDb.createNewConnection()
      const connModels = this.mongoDb.singleConnection(conn)
      
      const hashPassword = await this.crypt.encrypt(newUser.password)
      this.log.info('Encrypted Password')
      
      newUser.password = hashPassword
      newUser.id = randomUUID(cryptoOptions)

      const newUserEntry = new connModels.MUser({ ...newUser })
      const newUserResp = await connModels.MUser.create(newUserEntry)
      this.log.success(`New User added with User Id: ${newUserResp.id}`)

      const jwToken = await this.jwt.sign(newUserEntry.id)
      const newAccessToken = new connModels.MToken({
        userId: newUserResp.id,
        token: jwToken,
        issueDate: new Date().toISOString(),
        expiresIn: TIMESPAN
      })

      const resp = await connModels.MToken.create(newAccessToken)
      this.log.success(`New Token added with User Id: ${resp.userId}`)
      
      await conn.close()

      return jwToken
    } catch (err) {
      this.log.error(err)
      throw err
    }
  }
}