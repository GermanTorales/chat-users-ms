export class InvalidCredentialsException extends Error {
  constructor(data: { message: string }) {
    super(data.message);
  }
}
