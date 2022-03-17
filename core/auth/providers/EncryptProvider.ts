import { compare, hash } from 'bcrypt'

import { LogProvider } from '@core/providers/LogProvider'

const NAME = 'Encrypt Provider'

export class EncryptProvider {
  private log = new LogProvider(NAME)
  constructor(private saltRounds = 10) {
    this.log.initFileLogger()
  }

  async encrypt(data: string | Buffer): Promise<string> {
    try {
      this.log.getFileSystem().writeLogToFile(`Encrypting with salt rounds ${this.saltRounds}`, NAME)
      return await hash(data, this.saltRounds)
    } catch (err) {
      this.log.getFileSystem().writeLogToFile('Error encrypting data', NAME)
      throw err
    }
  }

  async compare(unEncryptedVal: string, encryptedVal: string): Promise<boolean> {
    try {
      return await compare(unEncryptedVal, encryptedVal)
    } catch (err) {
      this.log.getFileSystem().writeLogToFile('Error decrypting data', NAME)
      throw err
    }
  }
}