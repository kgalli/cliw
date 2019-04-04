import {Command} from '@oclif/command'

import ConfigUtils from './config/config-utils'

export default abstract class extends Command {
  async init() {
    if (!ConfigUtils.projectsConfigExists()) {
      this.error('Projects config does not exist. Use `init` sub command to set it.')
    }
  }
}
