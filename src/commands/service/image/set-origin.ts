import {flags} from '@oclif/command'

import {ImageOriginType} from '../../../types/service-image-origin-types-config'
import BaseCommand from '../../../wrapper/service'
import {serviceArg} from '../../../wrapper/service/args'
import {dryRunFlag, environmentFlag} from '../../../wrapper/service/flags'

export default class SetOrigin extends BaseCommand {
  static description = 'Set containers image origin (source|registry)'

  static flags = {
    environment: environmentFlag,
    'dry-run': dryRunFlag,
    help: flags.help({char: 'h'}),
  }

  static args = [
    serviceArg,
    {
      name: 'origin',
      required: true,
      description: 'origin of the container image',
      options: [ImageOriginType.REGISTRY, ImageOriginType.SOURCE],
    },
  ]

  async run() {
    const {args, flags} = this.parse(SetOrigin)
    const service = args.service
    const {environment} = flags
    const imageOrigin = args.origin as ImageOriginType

    try {
      if (imageOrigin) {
        this
        .imageOriginConfig()
        .updateImageOriginType([service], environment, imageOrigin)
      }
    } catch (error) {
      this.error(error.message, error)
    }
  }
}
