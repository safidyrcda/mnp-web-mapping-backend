import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FundingType } from 'src/infrastructure/models/funding.model';

export class CreateActivityEntryDto {
  @ApiProperty()
  @IsString()
  title!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateFundingDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'uuid-funder' })
  @IsUUID('4')
  funderId!: string;

  @ApiProperty({ enum: FundingType, required: false })
  @IsOptional()
  @IsEnum(FundingType)
  fundingType?: FundingType;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  protectedAreaIds!: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  debut?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  end?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  amountInEuro?: number;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  activityIds?: string[];

  @ApiProperty({ type: [CreateActivityEntryDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateActivityEntryDto)
  newActivities?: CreateActivityEntryDto[];
}
