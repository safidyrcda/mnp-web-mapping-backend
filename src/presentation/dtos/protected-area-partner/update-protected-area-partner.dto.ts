import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateProtectedAreaPartnerDto } from './create-protected-area-partner.dto';

export class UpdateProtectedAreaPartnerDto extends PartialType(
  OmitType(CreateProtectedAreaPartnerDto, ['protectedAreaId'] as const),
) {}
