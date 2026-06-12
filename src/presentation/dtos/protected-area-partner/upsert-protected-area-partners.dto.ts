import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartnerType } from 'src/infrastructure/models/protected-area-partner.model';

class PartnerEntryDto {
  @ApiProperty({ example: 'uuid-partner' })
  @IsUUID('4')
  partnerId!: string;

  @ApiProperty({ enum: PartnerType })
  @IsEnum(PartnerType)
  @IsNotEmpty()
  type!: PartnerType;
}

export class UpsertProtectedAreaPartnersDto {
  @ApiProperty({ type: [PartnerEntryDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PartnerEntryDto)
  entries!: PartnerEntryDto[];
}
