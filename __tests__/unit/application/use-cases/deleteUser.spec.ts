import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { Port } from '../../../../src/domain/enums/ports';
import { IDeleteUser, IUserRepository } from '../../../../src/domain/interfaces';
import { createFakeUsersArray } from '../../../factories';
import { DeleteUser } from '../../../../src/application/use-cases';
import { User } from '../../../../src/domain/entities';
import { UserNotFoundException } from '../../../../src/domain/exceptions';

describe('DeleteUserCreateUser use-case Test', () => {
  let userRepository: IUserRepository;
  let deleteUserUseCase: DeleteUser;
  let usersFakeArray: User[];

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
