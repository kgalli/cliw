import {execSync} from 'child_process'

export default class Bash {
  run(cmd: string, options: object) {
    console.log(`${cmd} ${options}`)
    //return execSync(cmd, option)
  }
}
