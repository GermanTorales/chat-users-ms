import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { Port } from '../../../../../src/application/enums';
import { UpdateUser } from '../../../../../src/application/use-cases';
import { createFakeUsersArray, updateFakeUser } from '../../../../factories';
import { IUserRepository } from '../../../../../src/application/repositories';
import { UserNotFoundException } from '../../../../../src/application/exceptions';
import { UpdateUserDTO } from '../../../../../src/application/dtos/updateUser.dto';
import { IUser } from '../../../../../src/application/interfaces';

describe('UpdateUser use-case Test', () => {
  let userRepository: IUserRepository;
  let updateUserUseCase: UpdateUser;
  let usersFakeArray: IUser[];

  beforeEach(async () => {
    usersFakeArray = await createFakeUsersArray();

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
      .mockImplementation(async (_id: string): Promise<IUser> => usersFakeArray.find(user => user._id === _id));

    jest.spyOn(userRepository, 'update').mockImplementation(async (_id: string, data: UpdateUserDTO): Promise<IUser> => {
      const user: IUser = usersFakeArray.find(user => user._id === _id);

      return { ...user, ...data };
    });

    const randomUser = usersFakeArray[faker.datatype.number({ min: 0, max: usersFakeArray.length - 1 })];
    const dataTuUpdate = updateFakeUser();
    const data = { ...randomUser, ...dataTuUpdate };

    const user = await updateUserUseCase.exec(randomUser._id, data);

    expect(user).toEqual(data);
  });

  it('should throw error if user does not exist', async () => {
    jest.spyOn(userRepository, 'findOne').mockImplementation(async (): Promise<IUser> => null);

    const randomUser = usersFakeArray[faker.datatype.number({ min: 0, max: usersFakeArray.length - 1 })];

    await expect(updateUserUseCase.exec(randomUser._id, randomUser)).rejects.toThrowError(UserNotFoundException);
  });
});
