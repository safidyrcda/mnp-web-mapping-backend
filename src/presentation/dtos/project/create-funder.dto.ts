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

export class CreateProjectDto {
  @ApiProperty({
    example: 'PCD',
    description: 'Nom u projet',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    example: 'Peche cotiere durable',
    description: 'Nom complet du projet',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly fullname: string;
}
