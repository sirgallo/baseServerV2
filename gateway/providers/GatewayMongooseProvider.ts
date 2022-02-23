import { Connection } from 'mongoose'

import { MongooseProvider } from '@core/providers/dataAccess/MongooseProvider'
import { 
  IUser, IQueryJob, IToken,
  UserSchema, QueryJobSchema, TokenSchema
} from '@db/models/Gateway'

import { mongoDbs } from '@gateway/configs/MongoTestConfig'

export class GatewayMongooseProvider extends MongooseProvider {
  MUser: any
  MQueryJob : any
  MToken: any
  
  initDefaultModels() {
    this.MUser = this.addModel<IUser>(this.mongoDb, mongoDbs.devModels.collections.User, UserSchema)
    this.MQueryJob = this.addModel<IQueryJob>(this.mongoDb, mongoDbs.devModels.collections.QueryJob, QueryJobSchema)
    this.MToken = this.addModel<IToken>(this.mongoDb, mongoDbs.devModels.collections.Token, TokenSchema)
  }

  singleConnection(conn: Connection) {
    return {
      MUser: this.addModel<IUser>(conn, mongoDbs.devModels.collections.User, UserSchema),
      MQueryJob: this.addModel<IQueryJob>(conn, mongoDbs.devModels.collections.QueryJob, QueryJobSchema),
      MToken: this.addModel<IToken>(this.mongoDb, mongoDbs.devModels.collections.Token, TokenSchema)
    }
  }
}