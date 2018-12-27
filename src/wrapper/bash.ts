import {execSync} from 'child_process'
import {isEmpty} from 'lodash'

export default class Bash {
  run(cmd: string, options: object) {
    const cmdOptions = isEmpty(options) ? '' : options
    console.log(`${cmd} ${cmdOptions}`)
    //return execSync(cmd, option)
  }
}
