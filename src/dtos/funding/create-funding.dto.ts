// src/presentation/dtos/prestation/create-prestation.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsEnum,
  Min,
  IsUUID,
  IsNotEmpty,
} from 'class-validator';

export class CreateFundingDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID du bailleur',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  readonly funderId: string;

  @ApiProperty({
    example: 'Nom',
    description: 'nom du projet',
    required: false,
  })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID de la zone protégée',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  readonly protectedAreaId: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID du projet',
    required: true,
  })
  @IsUUID()
  @IsOptional()
  readonly projectId?: string;
}
