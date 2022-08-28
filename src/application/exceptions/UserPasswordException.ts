export class UserPasswordException extends Error {
  constructor(message) {
    super(`Password are invalid: ${message}`);
  }
}
