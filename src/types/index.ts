export default interface ServiceWrapper {
  exec(options: ExecOptions, service: string, cmd: string): void;
  log(options: LogOptions, services: string[]): void;
  run(options: RunOptions, service: string, cmd: string): void;
  start(options: StartOptions, services: string[]): void;
  status(options: StatusOptions, services: string[]): void;
  stop(options: StopOptions, services: string[]): void;
  pull(options: PullOptions, services: string[]): void;
}

export interface ExecOptions {
  noTty: boolean;
}

export interface LogOptions {
  follow: boolean;
  timestamps: boolean;
}

export interface RunOptions {
  entrypoint?: string;
  noTty: boolean;
}

export interface StartOptions {
  build: boolean;
}

export interface StopOptions {
  timeout?: number;
}

export interface StatusOptions {
  showAll: boolean;
}

export interface PullOptions {
  quiet: boolean;
  includeDeps: boolean;
}

export type ShellCallback = (cmd: string) => void
export type ShellCallbackPromise = (cmd: string) => Promise<string>
