import {exec, execSync, ExecSyncOptionsWithStringEncoding} from 'child_process'

export interface ShellOptions {
  dryRun: boolean
  logger(message: string): void
}
export const shellCallback = (shellOptions: ShellOptions) => {
  if (shellOptions.dryRun) {
    return (cmd: string) => shellOptions.logger(cmd)
  }

  return (cmd: string): void => {
    const execSyncOptions: ExecSyncOptionsWithStringEncoding = {
      stdio: 'inherit',
      //stdio: 'ignore',
      encoding: 'utf8',
    }

    execSync(cmd, execSyncOptions)
  }
}

type callback = (cmd: string) => Promise<string>

export const shellCallbackPromise = (shellOptions: ShellOptions): callback => {
  if (shellOptions.dryRun) {
    return (cmd: string): Promise<string> => Promise.resolve(cmd)
  }

  return (cmd: string): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      if (shellOptions.dryRun) {
        return shellOptions.logger(cmd)
      }

      const child = exec(cmd, (error, stdout, stderr) => {
        if (error) {
          reject(error)
        }

        resolve(stdout)
      })

      child.stdout.on('data', function (data) {
        console.log(data.toString())
      })

    })
  }
}
