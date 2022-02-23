import { IMongoCredentials } from '@core/models/dataAccess/IMongoose'

//  passwords in plain text, testing
export const mongoTextConfig: IMongoCredentials= {
  host: 'devdbsingle',
  port: 27017,
  user: 'devDevUser',
  password: 'devTestPass'
}

export const mongoDbs = {
  devModels: {
    name: 'devModels',
    collections: {
      User: 'user',
      QueryJob: 'queryJob',
      Token: 'token'
    }
  }
}