import { Request, Response, NextFunction } from 'express'

import { BaseRoute } from '@core/baseServer/core/BaseRoute'

import { AuthProvider } from '@gateway/providers/AuthProvider'
import { GatewayMongooseProvider } from '@gateway/providers/GatewayMongooseProvider'
import { LogProvider } from '@core/providers/LogProvider'

import { gatewayRouteMappings } from '@gateway/configs/GatewayRouteMappings'

import { 
  IGatewayLoginRequest,
  IGatewayRegisterRequest 
} from '@gateway/models/IGatewayRequest'

const NAME = 'Gateway Route'

export class GatewayRoute extends BaseRoute {
  name = NAME
  private log: LogProvider = new LogProvider(NAME)
  private auth: AuthProvider
  constructor(rootpath: string, private mongoDb: GatewayMongooseProvider) {
    super(rootpath)
    this.auth = new AuthProvider(mongoDb)
    this.log.initFileLogger()
    this.router.post(gatewayRouteMappings.gateway.subRouteMapping.login.name, this.login.bind(this))
    this.router.post(gatewayRouteMappings.gateway.subRouteMapping.register.name, this.register.bind(this))
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const user: IGatewayLoginRequest = req.body
    try {
      const resp = await this.auth.authenticate(user)

      this.log.getFileSystem().custom(gatewayRouteMappings.gateway.subRouteMapping.login.customConsoleMessages[0], true)
      res
        .status(200)
        .send( { status: resp })
    } catch (err) {
      res
        .status(404)
        .send( { err, message: 'Error in Login Route' })
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    const newUser: IGatewayRegisterRequest = req.body
    try {
      const jwToken = await this.auth.register(newUser)
      this.log.getFileSystem().custom(gatewayRouteMappings.gateway.subRouteMapping.register.customConsoleMessages[0], true)
      res
        .status(200)
        .send({ status: 'User Registration Success', token: jwToken })
    } catch (err) {
      this.log.getFileSystem().error(err)
      res
        .status(404)
        .send( { err, message: 'Error in Registration Route' })
    }
  }
}