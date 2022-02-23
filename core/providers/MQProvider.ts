import { Request, Reply } from 'zeromq'
import { networkInterfaces } from 'os'

import { LogProvider } from '@core/providers/LogProvider'

const NAME = 'MQ Provider'

export class MQProvider {
  isPublisher = false
  isRunning = false
  sock: Request | Reply
  
  private log = new LogProvider(NAME)
  constructor(
    private address: string, 
    private port: string,
    private service: string,
    private producers: string [] = []
  ) {}

  setIsPublisher(role: boolean) {
    this.isPublisher = role
  }

  async run() {
    this.isRunning = true

    try {
      if (this.isPublisher) {
        this.sock = new Request()
        this.log.debug(`address: ${this.address}:${this.port}`)
        await this.sock.bind(`tcp://${this.address}:${this.port}`)
        this.log.success('Producer bound')
      } else {
        this.sock = new Reply()
        this.log.debug(`address: ${this.address}:${this.port}`)
        await this.sock.bind(`tcp://*:${this.port}`)
        this.log.success('Worker bound')
      }
    } catch (err) {
      this.log.error(err)
      this.isRunning = false
      throw err
    }
  }

  async request(newMessage: string): Promise<string> {
    this.log.debug('hi here')
    try {
      this.log.debug(newMessage)
      await (this.sock as Request).send(newMessage)
      const [ message ] = await (this.sock as Request).receive()

      return message.toString()
    } catch (err) {
      throw err
    }
  }

  async reply() {
    this.log.debug('hi in reply')
    try {
      for await (const [ message ] of this.sock as Reply) {
        this.log.debug(message.toString())
        await (this.sock as Reply).send(JSON.stringify(
          { 
            alive: true, 
            node: networkInterfaces()['eth0'][0].address,
            origMessage: Buffer.from(message).toString()
          }
        ))
      }
    } catch (err) {
      throw err
    }
  }

  close() {
    this.sock.close()
  }
}