import mongoose, { createConnection, Connection, connection, Schema, Model } from 'mongoose'

import { IMongoCredentials } from '@core/models/dataAccess/IMongoose'
import { LogProvider } from '../LogProvider'

export class MongooseProvider {
  mongoose = mongoose
  mongoDb: Connection
  private log = new LogProvider('Mongoose Provider')
  constructor(private creds: IMongoCredentials, private db: string) {}

  initDefault() {
    try {
      this.log.info(`Creating default mongo connection at ${this.getNormalizeHost()}`)
      mongoose.connect(this.getNormalizeHost())
      this.log.info(mongoose.connections)
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

  private normalizeConnOptions(db? ) {
    return {
      dbName: db,
      autoIndex: true,
      autoCreate: true
    }
  }

  addModel<T>(conn: Connection, db: string, mongoSchema: Schema) { 
    return conn.model<T>(db, mongoSchema)
  }

  async insert(mongoModelEntry) {
    try {
      return await mongoModelEntry.save()
    } catch (err) {
      this.log.error(`Error Inserting: ${err}`)
      throw err
    }
  }
}