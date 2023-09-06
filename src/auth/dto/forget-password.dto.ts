import { IsString } from 'class-validator';

export class ForgetPasswordAuthDto {
  @IsString()
  email: string;
}
