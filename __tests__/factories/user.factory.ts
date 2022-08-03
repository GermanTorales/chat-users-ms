import { faker } from '@faker-js/faker';
import { CreateUserDTO } from 'src/application/dtos';

export const createFakeUser = (): CreateUserDTO => ({
  name: faker.name.firstName(),
  username: faker.name.firstName(),
  password: faker.internet.password(),
  confirmPassword: faker.internet.password(),
});
