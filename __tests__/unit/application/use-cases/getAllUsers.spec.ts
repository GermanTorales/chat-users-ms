import { Test } from '@nestjs/testing';
import { Port } from '../../../../src/application/enums/ports.enum';
import { createFakeUsersArray } from '../../../factories';
import { GetAllUsers } from '../../../../src/application/use-cases';
import { User } from '../../../../src/domain/entities';
import { IUserRepository } from '../../../../src/application/repositories';

describe('GetAllUsers use-case Test', () => {
  let userRepository: IUserRepository;
  let getAllUsersUseCase: GetAllUsers;
  let usersFakeArray: User[];

  beforeEach(async () => {
    usersFakeArray = await createFakeUsersArray();

    const module = await Test.createTestingModule({
      providers: [
        GetAllUsers,
        {
          provide: Port.User,
          useFactory: () => ({ find: jest.fn() }),
        },
      ],
    }).compile();

    userRepository = module.get<IUserRepository>(Port.User);
    getAllUsersUseCase = module.get<GetAllUsers>(GetAllUsers);
  });

  it('should get all users', async () => {
    jest.spyOn(userRepository, 'find').mockImplementation(async () => usersFakeArray);

    const users = await getAllUsersUseCase.exec({});

    expect(users).toHaveLength(usersFakeArray.length);
  });
});
