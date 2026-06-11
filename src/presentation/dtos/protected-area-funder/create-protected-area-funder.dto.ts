import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsEnum } from 'class-validator';
import { ProtectedAreaFunderType } from 'src/infrastructure/models/protected-area-funder';

export class CreateProtectedAreaFunderDto {
  @ApiProperty({ example: 'uuid-protected-area' })
  @IsUUID('4')
  protectedAreaId!: string;

  @ApiProperty({ example: 'uuid-funder' })
  @IsUUID('4')
  funderId!: string;

  @ApiProperty({ enum: ProtectedAreaFunderType, required: false })
  @IsOptional()
  @IsEnum(ProtectedAreaFunderType)
  type?: ProtectedAreaFunderType;
}
