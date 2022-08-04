import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { Port } from '../../../../src/domain/enums/ports';
import { IUserRepository } from '../../../../src/domain/interfaces';
import { createFakeUsersArray, updateFakeUser } from '../../../factories';
import { UpdateUser } from '../../../../src/application/use-cases';
import { User } from '../../../../src/domain/entities';
import { UpdateUserDTO } from '../../../../src/application/dtos/updateUser.dto';
import { UserNotFoundException } from '../../../../src/domain/exceptions';

describe('CreateUser use-case Test', () => {
  let userRepository: IUserRepository;
  let updateUserUseCase: UpdateUser;
  let usersFakeArray: User[];

  beforeEach(async () => {
    usersFakeArray = createFakeUsersArray();

    const module = await Test.createTestingModule({
      providers: [
        UpdateUser,
        {
          provide: Port.User,
          useFactory: () => ({ update: jest.fn(), findOne: jest.fn() }),
        },
      ],
    }).compile();

    userRepository = module.get<IUserRepository>(Port.User);
    updateUserUseCase = module.get<UpdateUser>(UpdateUser);
  });

  it('should update user data', async () => {
    jest
      .spyOn(userRepository, 'findOne')
      .mockImplementation(async (_id: string): Promise<User> => usersFakeArray.find(user => user._id === _id));

    jest.spyOn(userRepository, 'update').mockImplementation(async (_id: string, data: UpdateUserDTO): Promise<User> => {
      const user = usersFakeArray.find(user => user._id === _id);

      return { ...user, ...data };
    });

    const randomUser = usersFakeArray[faker.datatype.number({ min: 0, max: usersFakeArray.length - 1 })];
    const dataTuUpdate = updateFakeUser();
    const data = { ...randomUser, ...dataTuUpdate };

    const user = await updateUserUseCase.exec(randomUser._id, data);

    expect(user).toEqual(data);
  });

  it('should throw error if user does not exist', async () => {
    jest.spyOn(userRepository, 'findOne').mockImplementation(async (): Promise<User> => null);

    const randomUser = usersFakeArray[faker.datatype.number({ min: 0, max: usersFakeArray.length - 1 })];

    await expect(updateUserUseCase.exec(randomUser._id, randomUser)).rejects.toThrowError(UserNotFoundException);
  });
});
