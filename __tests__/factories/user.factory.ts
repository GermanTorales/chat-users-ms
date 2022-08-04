import { faker } from '@faker-js/faker';
import { CreateUserDTO } from '../../src/application/dtos';
import { User } from '../../src/domain/entities';
import { UpdateUserDTO } from '../../src/application/dtos/updateUser.dto';

export const createFakeUser = (): CreateUserDTO => ({
  name: faker.name.firstName(),
  username: faker.name.firstName(),
  password: faker.internet.password(),
  confirmPassword: faker.internet.password(),
});

export const updateFakeUser = (): UpdateUserDTO => ({
  name: faker.name.firstName(),
  username: faker.name.firstName(),
});

export const createFakeUsersArray = (length = 10): User[] => {
  return [...new Array(length)].map((): User => {
    const { username, name } = createFakeUser();

    return { username, name, _id: faker.database.mongodbObjectId() };
  });
};
