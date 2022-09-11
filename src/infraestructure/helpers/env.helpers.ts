import * as dotenv from 'dotenv';
import { expand } from 'dotenv-expand';

export function expandEnvVariables(): void {
  const envConfig = dotenv.config({});
  expand(envConfig);
}
