import { Test } from '@nestjs/testing';
import { Port } from '../../../../../src/application/enums';
import { createFakeAuthUserDTO, createUserFake } from '../../../../factories';
import { AuthUser } from '../../../../../src/application/use-cases';
import { AuthUserDTO } from '../../../../../src/application/dtos';
import { User } from '../../../../../src/domain/entities';
import { IUserRepository } from '../../../../../src/application/repositories';

describe('AuthUser use-case Test', () => {
  let userRepository: IUserRepository;
  let authUserUseCase: AuthUser;
  let userFakeDTO: AuthUserDTO;
  let userFake: User;

  beforeEach(async () => {
    userFakeDTO = createFakeAuthUserDTO();
    userFake = await createUserFake();
    userFakeDTO.username = userFake.username;

    const module = await Test.createTestingModule({
      providers: [
        AuthUser,
        {
          provide: Port.User,
          useFactory: () => ({ findByFilter: jest.fn() }),
        },
      ],
    }).compile();

    userRepository = module.get<IUserRepository>(Port.User);
    authUserUseCase = module.get<AuthUser>(AuthUser);
  });

  it('should get user info', async () => {
    jest.spyOn(userRepository, 'findByFilter').mockImplementation(async () => userFake);

    const user = await authUserUseCase.exec(userFakeDTO);

    expect(user).toEqual({ username: userFake.username, _id: userFake._id });
  });

  it('should return null if user not found', async () => {
    jest.spyOn(userRepository, 'findByFilter').mockImplementation(async () => null);

    const user = await authUserUseCase.exec(userFakeDTO);

    expect(user).toBeNull();
  });

  it('should return null if password does not match', async () => {
    jest.spyOn(userRepository, 'findByFilter').mockImplementation(async () => userFake);

    userFake.password = 'other';
    const user = await authUserUseCase.exec(userFakeDTO);

    expect(user).toBeNull();
  });
});
