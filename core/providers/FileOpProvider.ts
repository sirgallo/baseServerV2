const path = require('path')

import { promisify } from 'util'
import { writeFile, existsSync, readFile, mkdir } from 'fs'
import { randomUUID } from 'crypto'

import { LogProvider } from '@core/providers/LogProvider'
import { IFileOpOpts } from '@core/models/IFileOp'

export const asyncWriteFile = promisify(writeFile)
export const asyncReadFile = promisify(readFile)
export const asyncMkdir = promisify(mkdir)

export class FileOpProvider {
  private log = new LogProvider('File Op Provider')
  constructor(private opts?: IFileOpOpts) {}

  exists(pathForFile: string): boolean {
    try { return existsSync(pathForFile) } 
    catch (err) { throw err }
  }

  async mkdir(path: string): Promise<boolean> {
    try { 
      await asyncMkdir(path) 

      return true
    } catch (err) { throw err }
  }

  async readFile(fileName: string) {
    try {
      this.log.info(`Attempting to read file: ${fileName}`)
      const res = await asyncReadFile(fileName, {
        ...this.opts?.encoding,
        ...this.opts?.flag
      })
      const jsonResult = JSON.parse(res.toString())
      this.log.success(`File successfully read to json object, returning result.`)

      return jsonResult
    } catch (err) { throw err }  
  }

  async writeLogFile(payload: any, fileName?: string, pathForFile?: string): Promise<string> {
    const filename = `${randomUUID({ disableEntropyCache: true })}.log`
    const fullPath =  pathForFile ? path.normalize(path.join(pathForFile, filename)) : path.normalize(path.join(process.cwd(), filename))
    
    try {
      this.log.info(`Attempting to write json payload to this path: ${fullPath}`)
      await asyncWriteFile(fullPath, payload, this.opts)
      this.log.success(`File written to ${fullPath}.`)

      return fullPath
    } catch (err) { throw err }
  }
}