import {Command} from '@oclif/command'

import {projectsConfigExists} from './config'

export default abstract class extends Command {
  async init() {
    if (!projectsConfigExists()) {
      this.error('Projects config does not exist. Use `init` sub command to set it.')
    }
  }
}
