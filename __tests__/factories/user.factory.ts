import { faker } from '@faker-js/faker';
import { AuthUserDTO, CreateUserDTO } from '../../src/application/dtos';
import { User } from '../../src/domain/entities';
import { UpdateUserDTO } from '../../src/application/dtos/updateUser.dto';
import { encryptPassword } from '../../src/application/helpers';

export const createFakeUser = (): CreateUserDTO => {
  const password = 'SecretPass_2022';
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();

  return {
    name: `${firstName} ${lastName}`,
    username: faker.internet.userName(firstName, lastName),
    password,
    confirmPassword: password,
  };
};

export const updateFakeUser = (): UpdateUserDTO => ({
  name: faker.name.firstName(),
  username: faker.name.firstName(),
});

export const createUserFake = async (): Promise<User> => {
  const password = await encryptPassword('secretPassword');
  const { username, name } = createFakeUser();
  const _id = faker.database.mongodbObjectId();

  return { username, name, _id, password };
};

export const createFakeUsersArray = async (length = 10): Promise<User[]> => {
  return Promise.all([...new Array(length)].map(async () => await createUserFake()));
};

export const createFakeAuthUserDTO = (): AuthUserDTO => {
  return {
    username: faker.name.firstName(),
    password: 'secretPassword',
  };
};
