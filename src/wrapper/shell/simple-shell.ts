type ShellCallback = (cmd: string) => void

export interface SimpleShellOptions {
  dryRun: boolean;
  currentWorkingDirectory?: string;
  print?: boolean;
  highlight?: boolean;
  logger(message: string): void;
}

const defaultOptions = (): SimpleShellOptions => ({
  logger: (): void => {},
  dryRun: false,
  print: false,
  highlight: true,
})

export default class SimpleShell {
  shellCallback: ShellCallback

  simpleShellOptions: SimpleShellOptions

  constructor(shellCallback: ShellCallback, options: SimpleShellOptions) {
    this.shellCallback = shellCallback
    this.simpleShellOptions = {...defaultOptions(), ...options}
  }

  run(cmd: string): void {
    if (this.simpleShellOptions.print || this.simpleShellOptions.dryRun) {
      this.simpleShellOptions.logger(`${cmd}`)
    }

    if (!this.simpleShellOptions.dryRun) {
      this.shellCallback(cmd)
    }
  }
}
