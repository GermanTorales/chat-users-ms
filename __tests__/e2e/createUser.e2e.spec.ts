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
import { CreateUserDTO } from '../../src/application/dtos';
import { AuthModule } from '../../src/infraestructure/modules';
import { User, UserSchema } from '../../src/domain/entities';
import { OrmModule } from '../../src/infraestructure/database/orm';
import { configuration } from '../../src/infraestructure/configurations';

describe('Create user e2e', () => {
  let app: INestApplication;
  let httpServer: any;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let userModel: Model<User>;
  let fakeUserDTO: CreateUserDTO;

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

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(httpServer).post('/auth/register').send(fakeUserDTO);

      expect(response.status).toBe(201);
      expect(JSON.parse(response.text)).toEqual(
        expect.objectContaining({
          message: 'New user created',
          data: {
            name: fakeUserDTO.name,
            username: fakeUserDTO.username,
            _id: expect.any(String),
          },
        })
      );
    });

    it('should throw error 400 for password and confirm password not equals', async () => {
      fakeUserDTO.confirmPassword = 'notEqualToPassword';

      const response = await request(httpServer).post('/auth/register').send(fakeUserDTO);

      expect(response.status).toBe(400);
      expect(JSON.parse(response.text)).toEqual({
        message: 'Password are invalid: password and confirm password are not equals',
        statusCode: 400,
        error: 'Bad Request',
      });
    });

    it('should throw error 400 for invalid password', async () => {
      fakeUserDTO.password = 'other';
      fakeUserDTO.confirmPassword = 'other';
      const response = await request(httpServer).post('/auth/register').send(fakeUserDTO);

      expect(response.status).toBe(400);
    });

    it('should throw error 400 existing user', async () => {
      await new userModel(fakeUserDTO).save();

      const response = await request(httpServer).post('/auth/register').send(fakeUserDTO);

      expect(response.status).toBe(400);
      expect(JSON.parse(response.text)).toEqual({
        message: 'User already exist',
        statusCode: 400,
        error: 'Bad Request',
      });
    });

    it('should throw error 400 for invalid name', async () => {
      fakeUserDTO.name = '1234';
      const response = await request(httpServer).post('/auth/register').send(fakeUserDTO);

      expect(response.status).toBe(400);
    });

    it('should throw error 400 for invalid username', async () => {
      fakeUserDTO.username = '14';
      const response = await request(httpServer).post('/auth/register').send(fakeUserDTO);

      expect(response.status).toBe(400);
    });
  });
});
