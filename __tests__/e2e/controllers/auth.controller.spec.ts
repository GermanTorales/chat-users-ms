import { JwtModule } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection, connect, Model } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createFakeUser } from '../../factories';
import { Entities, Port } from '../../../src/application/enums';
import { User, UserSchema } from '../../../src/domain/entities';
import { CreateUserDTO } from '../../../src/application/dtos';
import { AuthController } from '../../../src/infraestructure/controllers';
import { AuthJwt, CreateUser } from '../../../src/application/use-cases';
import { UserRepository } from '../../../src/infraestructure/repositories/UserRepository';

describe('Auth controller', () => {
  let authController: AuthController;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let userModel: Model<User>;
  let fakeUserDTO: CreateUserDTO;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    userModel = mongoConnection.model(Entities.User, UserSchema);

    const app: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        JwtModule.registerAsync({
          imports: [],
          useFactory: async () => {
            return {
              secret: 'secret',
              signOptions: { expiresIn: '1m' },
            };
          },
        }),
      ],
      controllers: [AuthController],
      providers: [
        AuthJwt,
        CreateUser,
        { provide: getModelToken(Entities.User), useValue: userModel },
        {
          provide: Port.User,
          useClass: UserRepository,
        },
      ],
    }).compile();

    authController = app.get<AuthController>(AuthController);

    app.useLogger(false);
  });

  beforeEach(() => {
    fakeUserDTO = createFakeUser();
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;

    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  describe('POST /auth/register', () => {
    it('should create a new user', async () => {
      const userCreated = await authController.create(fakeUserDTO);

      expect(userCreated.data.name).toEqual(fakeUserDTO.name);
      expect(userCreated.data.username).toEqual(fakeUserDTO.username);
    });

    it('should throw an error if other user exist with same username', async () => {
      await new userModel(fakeUserDTO).save();

      await expect(authController.create(fakeUserDTO)).rejects.toThrowError(BadRequestException);
    });

    it('should throw an error if then name is not valid', async () => {
      fakeUserDTO.name = '11111';

      await expect(authController.create(fakeUserDTO)).rejects.toThrowError(BadRequestException);
    });

    it('should throw an error if the username is not valid', async () => {
      fakeUserDTO.username = '123';

      await expect(authController.create(fakeUserDTO)).rejects.toThrowError(BadRequestException);
    });

    it('should throw an error if the password is not valid', async () => {
      fakeUserDTO.password = '123';

      await expect(authController.create(fakeUserDTO)).rejects.toThrowError(BadRequestException);
    });
  });
});
