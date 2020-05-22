import {flags as flagsHelper} from '@oclif/command'

import {ImageOriginType} from '../../types/service-image-origin-types-config'
import BaseCommand from '../../wrapper/service'
import {servicesArg} from '../../wrapper/service/args'
import {environmentFlag} from '../../wrapper/service/flags'

export default class Config extends BaseCommand {
  static description = 'List, set or validate service(s) configuration.'

  static flags = {
    environment: environmentFlag,
    help: flagsHelper.help({char: 'h', description: 'Show CLI help.'}),
    'image-origin': flagsHelper.string({
      char: 'i',
      description: 'Set service(s) image origin.',
      options: ['source', 'registry'],
      exclusive: ['validate', 'list'],
    }),
    validate: flagsHelper.boolean({
      description: 'Validate service(s) configuration.',
      allowNo: false,
      default: true,
      exclusive: ['image-origin', 'list'],
    }),
    list: flagsHelper.boolean({
      description: 'List service(s) configuration.',
      allowNo: false,
      default: true,
      exclusive: ['image-origin', 'list'],
    }),
  }

  static strict = false

  static args = [
    servicesArg,
  ]

  async run() {
    const {argv, flags} = this.parse(Config)
    const services = argv
    const {environment} = flags
    const imageOrigin = flags['image-origin'] as ImageOriginType

    try {
      this
        .imageOriginConfig()
        .updateImageOriginType(services, environment, imageOrigin)
    } catch (error) {
      this.error(error.message, error)
    }
  }
}
