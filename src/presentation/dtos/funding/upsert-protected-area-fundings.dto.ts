import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProtectedAreaFundingDto } from './create-protected-area-funding.dto';

export class UpsertProtectedAreaFundingsDto {
  @ApiProperty({ type: [CreateProtectedAreaFundingDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProtectedAreaFundingDto)
  entries!: CreateProtectedAreaFundingDto[];
}
