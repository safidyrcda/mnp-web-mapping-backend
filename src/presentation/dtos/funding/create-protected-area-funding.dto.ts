import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsNumber, IsString } from 'class-validator';

export class CreateProtectedAreaFundingDto {
  @ApiProperty({ example: 'uuid-ap' })
  @IsUUID('4')
  protectedAreaId!: string;

  @ApiProperty({ example: 500000, required: false })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiProperty({ example: 'USD', required: false })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ example: 450000, required: false })
  @IsOptional()
  @IsNumber()
  amountInEuro?: number;
}
