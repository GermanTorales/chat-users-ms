import { Test } from '@nestjs/testing';
import { createFakeUser } from '../../../../factories';
import { Port } from '../../../../../src/application/enums';
import { CreateUserDTO } from '../../../../../src/application/dtos';
import { CreateUser } from '../../../../../src/application/use-cases/User';
import { IUserRepository } from '../../../../../src/application/repositories';
import { UserAlreadyExistException, UserInvalidDataException, UserPasswordException } from '../../../../../src/application/exceptions';

fdescribe('CreateUser use-case Test', () => {
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

    userFake.confirmPassword = userFake.password;

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

  it('should throw error if password are not valid', async () => {
    jest.spyOn(userRepository, 'create').mockImplementation(async () => {
      throw new UserInvalidDataException({ message: 'Password are not valid', path: 'password', kind: '' });
    });

    userFake.confirmPassword = userFake.password;

    await expect(createUserUseCase.exec(userFake)).rejects.toThrowError(UserInvalidDataException);
  });

  it('should throw error if password and confirmPassword do not match', async () => {
    jest.spyOn(userRepository, 'findByFilter').mockImplementation(async () => null);

    userFake.confirmPassword = 'otherPass';

    await expect(createUserUseCase.exec(userFake)).rejects.toThrowError(UserPasswordException);
  });
});
