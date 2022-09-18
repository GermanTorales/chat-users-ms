import { faker } from '@faker-js/faker';
import { AuthUserDTO, CreateUserDTO } from '../../src/application/dtos';
import { UpdateUserDTO } from '../../src/application/dtos/updateUser.dto';
import { encryptPassword } from '../../src/application/helpers';
import { IUser } from '../../src/application/interfaces';

export const createFakeUser = (): CreateUserDTO => {
  const password = 'SecretPass_2022';
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();

  return {
    name: `${firstName} ${lastName}`,
    username: faker.internet.userName(firstName, lastName).substring(0, 19),
    password,
    confirmPassword: password,
  };
};

export const updateFakeUser = (): UpdateUserDTO => ({
  name: faker.name.firstName(),
  username: faker.name.firstName(),
});

export const createUserFake = async (): Promise<IUser> => {
  const password = await encryptPassword('secretPassword');
  const { username, name } = createFakeUser();
  const _id = faker.database.mongodbObjectId();

  return { username, name, _id, password };
};

export const createFakeUsersArray = async (length = 10): Promise<IUser[]> => {
  return Promise.all([...new Array(length)].map(async () => await createUserFake()));
};

export const createFakeAuthUserDTO = (): AuthUserDTO => {
  return {
    username: faker.name.firstName(),
    password: 'secretPassword',
  };
};
