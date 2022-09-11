import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { DATA_LENGTH } from '../../domain/enums';

export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(DATA_LENGTH.name.min, { message: 'Name shoud have at least 4 letters.' })
  @MaxLength(DATA_LENGTH.name.max, { message: 'Name shoud have a maximum of 20 letters.' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(DATA_LENGTH.username.min, { message: 'Username shoud have at least 4 characters.' })
  @MaxLength(DATA_LENGTH.username.max, { message: 'Username shoud have a maximum of 20 characters.' })
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(DATA_LENGTH.password.min, { message: 'Password shoud have at least 6 characters.' })
  @MaxLength(DATA_LENGTH.password.max, { message: 'Password shoud have a maximum of 30 characters.' })
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(DATA_LENGTH.password.min, { message: 'Confirm password shoud have at least 6 characters.' })
  @MaxLength(DATA_LENGTH.password.max, { message: 'Confirm password shoud have a maximum of 30 characters.' })
  confirmPassword: string;
}
