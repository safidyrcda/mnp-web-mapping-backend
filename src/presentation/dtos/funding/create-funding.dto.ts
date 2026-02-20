// src/presentation/dtos/prestation/create-prestation.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsUUID,
  IsNotEmpty,
  IsArray,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class CreateFundingDto {
  @ApiProperty({
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    description: 'IDs des bailleurs',
    required: true,
    type: [String],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsNotEmpty()
  readonly funders: string[];

  @ApiProperty({
    example: 'Nom du financement',
    description: 'Nom du financement',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID de la zone protégée',
    required: true,
  })
  @IsUUID('4')
  @IsNotEmpty()
  readonly protectedAreaId: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID du projet',
    required: false,
  })
  @IsUUID('4')
  @IsOptional()
  readonly projectId?: string;

  @ApiProperty({
    example: '2024-01-01',
    description: 'Date de début du financement',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  readonly debut?: string;

  @ApiProperty({
    example: '2026-12-31',
    description: 'Date de fin du financement',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  readonly end?: string;

  @ApiProperty({
    example: 500000,
    description: 'Montant du financement',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  readonly amount?: number;

  @ApiProperty({
    example: 'USD',
    description: 'Devise du financement',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly currency?: string;
}
