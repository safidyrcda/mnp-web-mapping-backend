import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateFunderFundingDto } from './create-funder-funding.dto';

export class UpsertFunderFundingsDto {
  @ApiProperty({ type: [CreateFunderFundingDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFunderFundingDto)
  entries!: CreateFunderFundingDto[];
}
