import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PartnerType } from 'src/infrastructure/models/protected-area-partner.model';

class PartnerEntryDto {
  @ApiProperty({ example: 'uuid-funder' })
  @IsUUID('4')
  funderId!: string;

  @ApiProperty({ enum: PartnerType })
  @IsEnum(PartnerType)
  type!: PartnerType;
}

export class UpsertProtectedAreaPartnersDto {
  @ApiProperty({ type: [PartnerEntryDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PartnerEntryDto)
  entries!: PartnerEntryDto[];
}
