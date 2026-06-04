import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsEnum } from 'class-validator';
import { FunderFundingType } from 'src/infrastructure/models/funding-funder.model';

export class CreateFunderFundingDto {
  @ApiProperty({ example: 'uuid-funder' })
  @IsUUID('4')
  funderId!: string;

  @ApiProperty({ enum: FunderFundingType, required: false })
  @IsOptional()
  @IsEnum(FunderFundingType)
  type?: FunderFundingType;
}
