import { IsString } from 'class-validator';

export class ForgetPasswordAuthDto {
  @IsString()
  username: string;
}
