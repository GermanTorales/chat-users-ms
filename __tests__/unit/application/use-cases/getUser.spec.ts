import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { Port } from '../../../../src/domain/enums/ports';
import { IUserRepository } from '../../../../src/domain/interfaces';
import { createFakeUsersArray } from '../../../factories';
import { GetUser } from '../../../../src/application/use-cases';
import { User } from '../../../../src/domain/entities';
import { UserNotFoundException } from '../../../../src/domain/exceptions';

describe('GetUser use-case Test', () => {
  let userRepository: IUserRepository;
  let getUserUseCase: GetUser;
  let usersFakeArray: User[];

  beforeEach(async () => {
    usersFakeArray = await createFakeUsersArray();

    const module = await Test.createTestingModule({
      providers: [
        GetUser,
        {
          provide: Port.User,
          useFactory: () => ({ findOne: jest.fn() }),
        },
      ],
    }).compile();

    userRepository = module.get<IUserRepository>(Port.User);
    getUserUseCase = module.get<GetUser>(GetUser);
  });

  it('should get user by ID', async () => {
    jest.spyOn(userRepository, 'findOne').mockImplementation(async (_id: string): Promise<User> => {
      const user = usersFakeArray.find(user => user._id === _id);

      return user;
    });

    const randomUser = usersFakeArray[faker.datatype.number({ min: 0, max: usersFakeArray.length - 1 })];
    const user = await getUserUseCase.exec(randomUser._id);

    expect(user).toEqual(randomUser);
  });

  it('should throw error if user not found', async () => {
    jest.spyOn(userRepository, 'findOne').mockImplementation(async (): Promise<User> => null);

    const randomUser = usersFakeArray[faker.datatype.number({ min: 0, max: usersFakeArray.length - 1 })];

    await expect(getUserUseCase.exec(randomUser._id)).rejects.toThrowError(UserNotFoundException);
  });
});
