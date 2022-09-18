import * as request from 'supertest';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { INestApplication } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { connect, Connection, Model } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createFakeUser } from '../factories';
import { AuthUserDTO, CreateUserDTO } from '../../src/application/dtos';
import { AuthModule } from '../../src/infraestructure/modules';
import { User, UserSchema } from '../../src/domain/entities';
import { OrmModule } from '../../src/infraestructure/database/orm';
import { configuration } from '../../src/infraestructure/configurations';

describe('Login user e2e', () => {
  let app: INestApplication;
  let httpServer: any;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let userModel: Model<User>;
  let fakeUserDTO: CreateUserDTO;
  let loginData: AuthUserDTO;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    userModel = mongoConnection.model(User.name, UserSchema);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
          isGlobal: true,
          cache: true,
          expandVariables: true,
        }),
        AuthModule,
        PassportModule,
        OrmModule.forRootAsync({
          useFactory: async () => {
            const uri = await mongod.getUri();

            return { uri };
          },
        }),
        JwtModule.registerAsync({
          useFactory: async () => {
            return {
              secret: 'secret',
              signOptions: { expiresIn: '1m' },
            };
          },
        }),
      ],
      providers: [{ provide: getModelToken(User.name), useValue: userModel }],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useLogger(false);

    await app.init();

    httpServer = app.getHttpServer();
  });

  beforeEach(async () => {
    fakeUserDTO = createFakeUser();
    loginData = { username: fakeUserDTO.username, password: fakeUserDTO.password };

    await new userModel(fakeUserDTO).save();
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
    await app.close();
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;

    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  describe('POST /auth/login', () => {
    it('should login correctly', async () => {
      const response = await request(httpServer).post('/auth/login').send(loginData);

      expect(response.status).toBe(200);
      expect(JSON.parse(response.text)).toEqual(
        expect.objectContaining({
          message: 'Successful login',
          data: {
            token: expect.any(String),
          },
        })
      );
    });

    it('should throw error 401 for invalid password', async () => {
      loginData.password = 'other';
      const response = await request(httpServer).post('/auth/login').send(loginData);

      expect(response.status).toBe(401);
    });

    it('should throw error 401 for nonexistent user', async () => {
      loginData.username = 'notFoundUser';
      const response = await request(httpServer).post('/auth/login').send(loginData);
      console.log(JSON.parse(response.text));
      expect(response.status).toBe(401);
    });
  });
});
