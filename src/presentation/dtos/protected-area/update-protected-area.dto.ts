import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsInt,
  IsArray,
} from 'class-validator';

export class UpdateProtectedAreaDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  superficie?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  creationYear?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  regions?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  districts?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  communes?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  populationCount?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  femaleClpNumber?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  maleClpNumber?: number;
}
