import {Command, flags} from '@oclif/command'
import {execSync} from 'child_process'
import * as inquirer from 'inquirer'
//import * as notifier from 'node-notifier'

export default class Start extends Command {
  static description = 'Start services in daemon mode'

  static flags = {
    help: flags.help({char: 'h'}),
    service: flags.string({
      char: 's',
      description: 'Specify the service',
      multiple: true,
      required: false,
      options: ['web', 'api']
    })
  }

  async run() {
    const {flags} = this.parse(Start)

    let service = flags.service
    if (!service) {
      let responses: any = await inquirer.prompt([{
        name: 'stage',
        message: 'select a stage',
        type: 'list',
        choices: [{name: 'development'}, {name: 'staging'}, {name: 'production'}],
      }])
      service = responses.stage
    }
    this.log(`hello ${service} from /Users/kgalli/dev/orchestrator/src/commands/start.ts`)
    const ls = execSync('ls')
    this.log(ls.toString())
    this.warn('uh oh!')
    this.error('uh oh!', {exit: 2})
  }
}
