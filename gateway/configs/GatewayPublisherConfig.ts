import { IMqOpts } from '@core/models/IMq'

export const gatewayPublisherConfig: IMqOpts = {
  port: '8765',
  topic: 'queryJobQueue'
}