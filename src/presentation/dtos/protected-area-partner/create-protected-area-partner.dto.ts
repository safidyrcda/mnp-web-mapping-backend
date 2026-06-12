import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsEnum, IsNotEmpty } from 'class-validator';
import { PartnerType } from 'src/infrastructure/models/protected-area-partner.model';

export class CreateProtectedAreaPartnerDto {
  @ApiProperty({ example: 'uuid-protected-area' })
  @IsUUID('4')
  protectedAreaId!: string;

  @ApiProperty({ example: 'uuid-partner' })
  @IsUUID('4')
  partnerId!: string;

  @ApiProperty({ enum: PartnerType, example: PartnerType.TECHNICAL_PARTNER })
  @IsEnum(PartnerType)
  @IsNotEmpty()
  type!: PartnerType;
}
