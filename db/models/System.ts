import { Schema, Document } from 'mongoose' 

export const SystemsCollectionsName = 'system'

export interface ISystem extends Document {
  id: string
  hostIp: string
}

export const SystemSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true},
  hostIp: { type: String, required: true, unique: true}
}, { collection: SystemsCollectionsName })