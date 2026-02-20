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
