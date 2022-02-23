import { Schema, Document } from 'mongoose' 

export type LifeCycle = 'Not Started' | 'In Progress' | 'Failed' | 'Finished'
export type DBTypes = 'MariaDb' | 'Presto' | 'Trino' | 'Athena'
export type AccessControlLevel = 'Dev' | 'Admin' | 'User'

export const OrganizationCollectionName = 'org'
export const QueryJobCollectionName = 'queryJob'
export const TokenCollectionName = 'token'
export const UserCollectionName = 'user'

export interface IOrganization extends Document {
  id: string
  orgName: string
}

export interface IQueryJob extends Document {
  jobId: string
  payload: string
  authJwt: string
  organization: string
  dbType: DBTypes
  lifeCycle: LifeCycle
}

export interface IUser extends Document {
  id: string | null
  firstName: string
  lastName: string
  email: string
  password: string
  organization: string
  accessControlLevel: AccessControlLevel
}

export interface IToken extends Document {
  userId: string
  token: string
  issueDate: Date
  expiresOn: string
}

export const OrganizationSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true},
  orgName: { type: String, required: true, unique: true}
}, { collection: OrganizationCollectionName })

export const QueryJobSchema: Schema = new Schema({
  jobId: { type: String, required: true, unique: true },
  query: { type: String, required: true, unique: false },
  authJwt: { type: String, required: true, unique: false },
  organization: { type: String, required: true, unique: false },
  dbType: { type: String, required: true, unique: false },
  lifeCycle: { type: String, required: true, unique: false },
}, { collection: QueryJobCollectionName })

export const UserSchema: Schema = new Schema({
  id: { type: String, index: true, required: true, unique: false },
  firstName: { type: String, required: true, unique: false },
  lastName: { type: String, required: true, unique: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true },
  organization: { type: String, required: true, unique: false },
  accessControlLevel: { type: String, required: true, unique: false },
}, { collection: UserCollectionName })

export const TokenSchema: Schema = new Schema({
  userId: { type: String, index: true, required: true, unique: true},
  token: { type: String, required: true, unique: false },
  issueDate: { type: Date, index: true, required: true, unique: true },
  expiresIn: { type: String, index: false, required: true, unique: false }
}, { collection: TokenCollectionName })