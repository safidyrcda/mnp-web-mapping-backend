import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateProtectedAreaFunderDto } from './create-protected-area-funder.dto';

export class UpdateProtectedAreaFunderDto extends PartialType(
  OmitType(CreateProtectedAreaFunderDto, ['protectedAreaId'] as const),
) {}
