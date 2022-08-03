import { Test } from '@nestjs/testing';
import { Port } from '../../../../src/domain/enums/ports';
import { IUserRepository } from 'src/domain/interfaces';
import { CreateUser } from '../../../../src/application/use-cases/CreateUser';
import { CreateUserDTO } from '../../../../src/application/dtos';
import { createFakeUser } from '../../../factories';
import { UserAlreadyExistException } from '../../../../src/domain/exceptions';

describe('CreateUser use-case Test', () => {
  let userRepository: IUserRepository;
  let createUserUseCase: CreateUser;
  let userFake: CreateUserDTO;

  beforeEach(async () => {
    userFake = createFakeUser();

    const module = await Test.createTestingModule({
      providers: [
        CreateUser,
        {
          provide: Port.User,
          useFactory: () => ({ create: jest.fn(), findByFilter: jest.fn() }),
        },
      ],
    }).compile();

    userRepository = module.get<IUserRepository>(Port.User);
    createUserUseCase = module.get<CreateUser>(CreateUser);
  });

  it('should create a new user', async () => {
    jest.spyOn(userRepository, 'findByFilter').mockImplementation(async () => null);
    jest.spyOn(userRepository, 'create').mockImplementation(async data => ({
      name: data.name,
      username: data.username,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    const newUser = await createUserUseCase.exec(userFake);

    expect(newUser).toEqual(
      expect.objectContaining({
        name: userFake.name,
        username: userFake.username,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    );
  });

  it('should throw error if user already exist', async () => {
    jest.spyOn(userRepository, 'findByFilter').mockImplementation(async () => userFake);

    await expect(createUserUseCase.exec(userFake)).rejects.toThrowError(UserAlreadyExistException);
  });
});
