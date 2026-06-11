import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsOptional,
  IsEnum,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProtectedAreaFunderType } from 'src/infrastructure/models/protected-area-funder';

class FunderEntryDto {
  @ApiProperty({ example: 'uuid-funder' })
  @IsUUID('4')
  funderId!: string;

  @ApiProperty({ enum: ProtectedAreaFunderType, required: false })
  @IsOptional()
  @IsEnum(ProtectedAreaFunderType)
  type?: ProtectedAreaFunderType;
}

export class UpsertProtectedAreaFundersDto {
  @ApiProperty({ type: [FunderEntryDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FunderEntryDto)
  entries!: FunderEntryDto[];
}
