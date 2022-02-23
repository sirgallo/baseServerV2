import { BaseServer } from '@baseServer/core/BaseServer'

import { GatewayRoute } from '@gateway/routes/GatewayRoute'
import { LogProvider } from '@core/providers/LogProvider'

import { GatewayMongooseProvider } from '@gateway/providers/GatewayMongooseProvider'

import { gatewayRouteMappings } from '@gateway/configs/GatewayRouteMappings'
import { mongoDbs, mongoTextConfig } from '@gateway/configs/MongoTestConfig'

export class InitGatewayServer extends BaseServer {
  private gatewayLog: LogProvider = new LogProvider(this.name)
  
  async startServer() {
    try {
      const gatewayMongoDb: GatewayMongooseProvider = new GatewayMongooseProvider(mongoTextConfig, mongoDbs.devModels.name)
      gatewayMongoDb.initDefault()
      gatewayMongoDb.initDefaultModels()
      this.gatewayLog.success('Initialized Db Models')

      const gatewayRoute = new GatewayRoute(gatewayRouteMappings.gateway.name, gatewayMongoDb)
      this.setRoutes([ gatewayRoute ])

      this.run()
    } catch (err) {
      this.gatewayLog.error(err)
      throw err
    }
  }
}