import {flags} from '@oclif/command'
import {cli} from 'cli-ux'
import {isEmpty} from 'lodash'

import BaseCommand from '../base'
import InitConfigRepo from '../config/init-config-repo'

export default class Init extends BaseCommand {
  static description = `initialize and manage project config

  The cli needs to know the location of the main-config.json
file to properly work. The 'init' command is used to determine
this location form the user and store it for later use in the
file: ~/.orchestrator-init-config.json.
  `
  static flags = {
    mainConfig: flags.string({
      char: 'm',
      description: 'location of the main-config.json file'
    }),
    help: flags.help({char: 'h'})
  }

  async run() {
    const {flags} = this.parse(Init)
    let mainConfigLocation

    if (isEmpty(flags.mainConfig)) {
      mainConfigLocation = await cli.prompt('Please enter the location of your <main-config>.json file')
    } else {
      mainConfigLocation = flags.mainConfig
    }

    const initConfig = {mainConfigLocation}
    const initConfigRepo = new InitConfigRepo()

    initConfigRepo.save(initConfig)
  }
}
