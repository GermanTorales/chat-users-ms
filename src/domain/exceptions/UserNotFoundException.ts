export class UserNotFoundException extends Error {
  constructor(_id: string) {
    super(`User with id ${_id} not found in database`);
  }
}
