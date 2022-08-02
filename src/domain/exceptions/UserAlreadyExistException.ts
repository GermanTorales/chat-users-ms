export class UserAlreadyExistException extends Error {
  constructor() {
    super('User already exist');
  }
}
