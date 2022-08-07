export class UserInvalidDataException extends Error {
  private readonly path: string;
  private readonly kind: string;

  constructor(data: { message: string; path: string; kind: string }) {
    super(data.message);

    this.path = data.path;
    this.kind = data.kind;
  }
}
