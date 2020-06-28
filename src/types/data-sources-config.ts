export interface DataSourcesConfig {
  environments: string[];
  defaultEnvironment: string;
  dataSources: NameWrapper[];
}

interface NameWrapper {
  name: string;
  environments: DataSource[];
}

interface SshParams {
  beforeShellCmd?: string;
  jumpHost: string;
  localPort: number;
}

export interface DataSource {
  name: string;
  host: string;
  port: number;
  user: string;
  password: string;
  passwordEncryption: string;
  database: string;
  engine: DbEngine;
  readonly: boolean;
  ssh?: SshParams;
}

export const enum PasswordEncryption {
  NONE = 'none', AWSKMS = 'amskms'
}

export const enum DbEngine {
  POSTGRES = 'postgresql', MYSQL = 'mysql'
}
