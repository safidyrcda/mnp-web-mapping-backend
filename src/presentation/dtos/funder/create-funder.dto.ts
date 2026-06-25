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

export class CreateFunderDto {
  @ApiProperty({
    example: 'KFW',
    description: 'Nom du bailleur',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}

export class UpdateFunderDto {
  @ApiProperty({ example: 'KFW', required: false })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({ example: 'Kreditanstalt für Wiederaufbau', required: false })
  @IsOptional()
  @IsString()
  readonly fullname?: string;
}
