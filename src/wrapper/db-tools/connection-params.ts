export default interface ConnectionParams {
  host: string;
  port: number;
  user: string;
  password: string;
  database?: string;
  command?: string;
}
