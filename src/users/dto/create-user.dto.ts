import {
  IsString,
  IsEmail,
  IsStrongPassword,
  IsOptional,
} from 'class-validator';
export class CreateUserDto {
  @IsString()
  readonly username: string;
  @IsEmail()
  readonly email: string;
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  readonly password: string;

  @IsString()
  @IsOptional()
  readonly bio?: string;
}
