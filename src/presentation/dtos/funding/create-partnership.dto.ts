// src/presentation/dtos/funding/create-partnership.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FunderFundingType } from 'src/infrastructure/models/funding-funder.model';
import { CreateActivityDto } from 'src/presentation/dtos/activity/create-activity.dto';
import { FundingType } from 'src/infrastructure/models/funding.model';

export class CreatePartnershipDto {
  @ApiProperty({ example: 'uuid-funder' })
  @IsUUID('4')
  funderId!: string;

  @ApiProperty({ enum: FundingType })
  @IsEnum(FundingType)
  fundingType!: FundingType;

  @ApiProperty({
    type: [String],
    description: 'IDs des aires protégées concernées',
  })
  @IsArray()
  @ArrayMinSize(1, {
    message: 'Au moins une aire protégée doit être sélectionnée.',
  })
  @IsUUID('4', { each: true })
  protectedAreaIds!: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  debut?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  end?: string;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  activityIds?: string[];

  @ApiProperty({ type: [CreateActivityDto], required: false })
  @IsOptional()
  @IsArray()
  @Type(() => CreateActivityDto)
  newActivities?: CreateActivityDto[];
}
