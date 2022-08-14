import { expandEnvVariables } from '../helpers';

expandEnvVariables();

export enum EnvObjects {
  MONGO_OPTIONS = 'MongoOptions',
  JWT_OPTIONS = 'JwtOptions',
}

export interface MongoOptions {
  host: string;
  options: {
    authSource: string;
    useNewUrlParser: boolean;
    useUnifiedTopology: boolean;
  };
}

export interface JwtOptions {
  secret: string;
  expiresIn: string;
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
  JwtOptions: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
});
