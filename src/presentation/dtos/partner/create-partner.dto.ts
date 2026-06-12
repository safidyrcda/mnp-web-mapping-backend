import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class CreatePartnerDto {
  @ApiProperty({ example: 'WWF' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'World Wildlife Fund', required: false })
  @IsOptional()
  @IsString()
  fullname?: string;
}
