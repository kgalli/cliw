import {flags} from '@oclif/command'
import {cli} from 'cli-ux'

import BaseCommand from '../../../wrapper/service'
import {servicesArg} from '../../../wrapper/service/args'
import {environmentFlag} from '../../../wrapper/service/flags'

interface ServiceImageOriginMap {
  [key: string]: string
}

export default class List extends BaseCommand {
  static description = 'List service(s) origin SOURCE|REGISTRY'

  static flags = {
    help: flags.help({char: 'h'}),
    environment: environmentFlag,
  }

  static args = [
    servicesArg
  ]

  async run() {
    const {argv, flags} = this.parse(List)
    const services = argv
    const environment = flags.environment
    const imageOriginConfig = this.imageOriginConfig().load()
    const imageOrigins = imageOriginConfig.environments.find(env => env.name === environment)
    const serviceImageOriginMap = {} as ServiceImageOriginMap
    const serviceImageOrigins = imageOrigins ? imageOrigins.services : []

    serviceImageOrigins
      .forEach(service => serviceImageOriginMap[service.name] = service.imageOriginType)

    const data = [] as any
    Object.keys(serviceImageOriginMap).forEach(serviceName => {
      const imageOrigin = serviceImageOriginMap[serviceName]

      if (services.length === 0 || services.includes(serviceName)) {
        data.push({name: serviceName, imageOrigin: (imageOrigin).toUpperCase()})
      }
    })

    cli.table(data, {name: {header: 'Service', minWidth: 7}, imageOrigin: {header: 'ImageOrigin'}}, {
      printLine: this.log
    })
  }
}
