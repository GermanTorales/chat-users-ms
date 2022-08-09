import { IsNotEmpty } from 'class-validator';

export class AuthUserDTO {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
