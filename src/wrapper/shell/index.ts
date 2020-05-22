import {exec, execSync, ExecSyncOptionsWithStringEncoding} from 'child_process'

import SimpleShell from './simple-shell'

const shellCallback = (cmd: string): void => {
  const execSyncOptions: ExecSyncOptionsWithStringEncoding = {
    //stdio: 'inherit',
    //stdio: 'ignore',
    encoding: 'utf8',
  }

  execSync(cmd, execSyncOptions)
}

const shellCallbackPromise = (cmd: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(error)
      }
      resolve(stdout)
    })
  })
}

export interface ShellOptions {
  dryRun: boolean
  logger(message: string): void
}

export default async (cmd: string, shellOptions: ShellOptions): Promise<string> => {
  const simpleShell = new SimpleShell(
    shellCallback,
    {
      dryRun: shellOptions.dryRun,
      logger: shellOptions.logger,
    },
  )

  //simpleShell.run(cmd);
  return shellCallbackPromise(cmd)
}
