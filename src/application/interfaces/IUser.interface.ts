export interface IDeleteUser {
  acknowledged: boolean;
  deletedCount: number;
}

export interface IUser {
  _id?: string;
  name: string;
  username: string;
  password?: string;
  confirmPassword?: string;
}
