export class UserAlreadyExistException extends Error {
  private readonly username: string;
  private readonly userId: string;

  constructor(user: { userId?: string; username?: string }) {
    super('User already exist');

    this.userId = user.userId;
    this.username = user.username;
  }
}
