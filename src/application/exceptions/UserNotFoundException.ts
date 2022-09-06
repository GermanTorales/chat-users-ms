export class UserNotFoundException extends Error {
  private readonly username: string;
  private readonly userId: string;

  constructor(user: { userId?: string; username?: string }) {
    super(`User with id ${user.userId} not found in database`);

    this.userId = user.userId;
    this.username = user.username;
  }
}
