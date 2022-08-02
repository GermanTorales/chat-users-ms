import { expandEnvVariables } from '../../domain/helpers';

expandEnvVariables();

export enum EnvObjects {
  MONGO_OPTIONS = 'MongoOptions',
}

export interface MongoOptions {
  host: string;
  options: {
    authSource: string;
    useNewUrlParser: boolean;
    useUnifiedTopology: boolean;
  };
}

export const configuration = (): any => ({
  MongoOptions: {
    host: `mongodb://${process.env.MONGO_HOST}`,
    options: {
      dbName: process.env.MONGO_DB_NAME,
      auth: {
        username: process.env.MONGO_USER,
        password: process.env.MONGO_PASS,
      },
    },
  },
});
