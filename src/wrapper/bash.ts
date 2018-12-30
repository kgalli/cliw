import {isEmpty} from 'lodash'

export default class Bash {
  run(cmd: string, options: object) {
    const cmdOptions = isEmpty(options) ? '' : options
    // tslint:disable-next-line no-console
    console.log(`${cmd} ${cmdOptions}`)
    //return execSync(cmd, option)
  }
}
