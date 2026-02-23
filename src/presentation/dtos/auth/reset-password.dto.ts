import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ example: 'newstrongpassword' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
