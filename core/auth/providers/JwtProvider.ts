import { randomUUID } from 'crypto'
import { sign, verify } from 'jsonwebtoken'

import { LogProvider } from '@core/providers/LogProvider'
import { cryptoOptions } from '@core/crypto/CryptoOptions'

const SECRET = randomUUID(cryptoOptions)
export const TIMESPAN = '1d'

export class JwtProvider {
  private log = new LogProvider('JWT Prov')
  constructor() {
    this.log.initFileLogger()
  }

  async sign(userId: string, secretOrPemKey = SECRET, timeSpan = TIMESPAN): Promise<string> {
    return await new Promise( (resolve, reject) => {
      try {
        this.log.getFileSystem().info('Signing JWT')
        const signedJwt = sign({ id: userId }, secretOrPemKey, { expiresIn: timeSpan })
        return resolve(signedJwt)
      } catch (err) {
        this.log.getFileSystem().error('Error signing JWT')
        return reject(err)
      }
    })
  }

  async withinExpiration(token: string): Promise<{ token: string, verified: boolean}> {
    return await new Promise( (resolve, reject) => {
      try {
        const decodedJwt = verify(token, SECRET, { complete: true })
        if (decodedJwt) {
          return resolve({ token, verified: true })
        }
      } catch (err) {
        return reject(err)
      }
    })
  }
}