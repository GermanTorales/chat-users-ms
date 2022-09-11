import { IsNotEmpty, IsString } from 'class-validator';

export class AuthUserDTO {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
