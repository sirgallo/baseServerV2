import { 
  AccessControlLevel,
} from '@db/models/Gateway'

export interface IGatewayLoginRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  organization: string
  accessControlLevel: AccessControlLevel
}

export interface IGatewayRegisterRequest {
  email: string
  password: string
}