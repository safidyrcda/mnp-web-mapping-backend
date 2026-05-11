import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateDisbursementDto } from '../disbursement/create-disbursement.dto';
import { CreateActivityDto } from '../activity/create-activity.dto';

export class CreateFundingDto {
  @ApiProperty({
    example: ['uuid-bailleur-1', 'uuid-bailleur-2'],
    description: 'IDs des bailleurs/partenaires',
    type: [String],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsNotEmpty()
  readonly funders!: string[];

  @ApiProperty({ example: 'Breve description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: ['uuid-ap-1', 'uuid-ap-2'],
    description: 'IDs des aires protégées concernées (1 ou plusieurs)',
    type: [String],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsNotEmpty()
  readonly protectedAreaIds!: string[]; // MODIFIÉ : était protectedAreaId (singulier)

  @ApiProperty({ example: 'MIARO SY MIKOLO', required: false })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({ example: 'uuid-projet', required: false })
  @IsUUID('4')
  @IsOptional()
  readonly projectId?: string;

  @ApiProperty({ example: '2024-01-01', required: false })
  @IsOptional()
  @IsDateString()
  readonly debut?: string;

  @ApiProperty({ example: '2026-12-31', required: false })
  @IsOptional()
  @IsDateString()
  readonly end?: string;

  @ApiProperty({ example: 500000, required: false })
  @IsOptional()
  @IsNumber()
  readonly amount?: number;

  @ApiProperty({ example: 'USD', required: false })
  @IsOptional()
  @IsString()
  readonly currency?: string;

  @ApiProperty({
    example: 450000,
    required: false,
    description: 'Montant converti en Euro',
  })
  @IsOptional()
  @IsNumber()
  readonly amountInEuro?: number;

  @ApiProperty({ type: [CreateDisbursementDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDisbursementDto)
  readonly disbursements?: CreateDisbursementDto[];

  @ApiProperty({
    example: ['uuid-activity-1', 'uuid-activity-2'],
    description: 'IDs des activités existantes à lier à ce financement',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  readonly activityIds?: string[];

  @ApiProperty({
    type: [CreateActivityDto],
    required: false,
    description:
      'Nouvelles activités à créer et lier automatiquement à ce financement',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateActivityDto)
  readonly newActivities?: CreateActivityDto[];
}
