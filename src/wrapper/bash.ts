import {execSync} from 'child_process'
import {isEmpty} from 'lodash'

interface ShellOptions {
  dryRun: boolean;
  print: boolean;
  highlight: boolean;
}

export default class Bash {
  static defaultOptions(): ShellOptions {
    return {
      dryRun: false,
      print: false,
      highlight: true,
    }
  }

  options: ShellOptions

  constructor(options: ShellOptions) {
    this.options = {...Bash.defaultOptions(), ...options}
  }

  run(cmd: string, options: object) {
    const cmdOptions = isEmpty(options) ? '' : options

    if (this.options.print || this.options.dryRun) {
      // eslint-disable-next-line no-console
      console.log(`${cmd} ${cmdOptions}`)
    }

    if (!this.options.dryRun) {
      try {
        return execSync(`${cmd} ${cmdOptions}`, {stdio: 'inherit'})
        // tslint:disable no-unused
      } catch (error) {
        // TODO append error to the error log
        // do nothing because wrapped command should already print error
        // eslint-disable-next-line no-process-exit,unicorn/no-process-exit
        process.exit(1)
      }
    }
  }
}
