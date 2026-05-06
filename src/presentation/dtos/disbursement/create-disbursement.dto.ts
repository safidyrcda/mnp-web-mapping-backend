import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateDisbursementDto {
  @ApiProperty({ example: '2025-03-15' })
  @IsDateString()
  readonly date!: string;

  @ApiProperty({ example: 'Premier décaissement - Tranche 1', required: false })
  @IsOptional()
  @IsString()
  readonly note?: string;

  @ApiProperty({ example: 150000 })
  @IsNumber()
  readonly amount!: number;

  @ApiProperty({ example: 'EUR', required: false })
  @IsOptional()
  @IsString()
  readonly currency?: string;

  @ApiProperty({ example: 150000, required: false })
  @IsOptional()
  @IsNumber()
  readonly amountInEuro?: number;
}
