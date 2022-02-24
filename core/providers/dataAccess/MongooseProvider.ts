import mongoose, { Connection, Schema } from 'mongoose'

import { IMongoCredentials } from '@core/models/dataAccess/IMongoose'
import { LogProvider } from '../LogProvider'

export class MongooseProvider {
  mongoose = mongoose
  mongoDb: Connection
  private log = new LogProvider('Mongoose Provider')
  constructor(private creds: IMongoCredentials, private db: string) {}

  initDefault() {
    try {
      this.log.info(`Creating default mongo connection`)
      mongoose.connect(this.getNormalizeHost())
      this.mongoDb = mongoose.connection
      this.dbOn(this.mongoDb)
    } catch (err) {
      throw err
    }
  }

  async createNewConnection() {
    const newConn = mongoose.createConnection(this.getNormalizeHost(), this.normalizeConnOptions(this.db))
    this.dbOn(newConn)
    return newConn
  }

  private dbOn(conn: Connection) {
    conn.on('open', () => this.log.info('Successfully made mongo connection'))
    conn.on('error', err => {
      this.log.error('Hi')
      this.log.error(err)
      throw err
    })
  }

  private getNormalizeHost(): string {
    return `mongodb://${this.creds.user}:${this.creds.password}@${this.creds.host}:${this.creds.port}/${this.db}`
  }

  private normalizeConnOptions(db: string) {
    return {
      dbName: db,
      autoIndex: true,
      autoCreate: true
    }
  }

  addModel<T>(conn: Connection, db: string, mongoSchema: Schema) { 
    return conn.model<T>(db, mongoSchema)
  }
}