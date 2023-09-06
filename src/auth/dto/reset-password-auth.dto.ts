import { IsJWT, IsString, MinLength } from 'class-validator';

export class ResetPasswordAuthDto {
  @IsJWT()
  token: string;

  @IsString()
  @MinLength(8)
  password: string;
}
