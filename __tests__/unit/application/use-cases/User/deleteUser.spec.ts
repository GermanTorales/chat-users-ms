import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { Port } from '../../../../../src/application/enums';
import { createFakeUsersArray } from '../../../../factories';
import { DeleteUser } from '../../../../../src/application/use-cases';
import { IDeleteUser, IUser } from '../../../../../src/application/interfaces';
import { IUserRepository } from '../../../../../src/application/repositories';
import { UserNotFoundException } from '../../../../../src/application/exceptions';

describe('DeleteUserCreateUser use-case Test', () => {
  let userRepository: IUserRepository;
  let deleteUserUseCase: DeleteUser;
  let usersFakeArray: IUser[];

  beforeEach(async () => {
    usersFakeArray = await createFakeUsersArray();

    const module = await Test.createTestingModule({
      providers: [
        DeleteUser,
        {
          provide: Port.User,
          useFactory: () => ({ delete: jest.fn() }),
        },
      ],
    }).compile();

    userRepository = module.get<IUserRepository>(Port.User);
    deleteUserUseCase = module.get<DeleteUser>(DeleteUser);
  });

  it('should delete user by ID', async () => {
    jest.spyOn(userRepository, 'delete').mockImplementation(async (): Promise<IDeleteUser> => null);

    const userFake = usersFakeArray[faker.datatype.number({ min: 0, max: usersFakeArray.length - 1 })];

    await expect(deleteUserUseCase.exec(userFake._id)).rejects.toThrowError(UserNotFoundException);
  });
});
