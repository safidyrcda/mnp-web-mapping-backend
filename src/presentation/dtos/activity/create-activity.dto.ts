import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateActivityDto {
  @ApiProperty({ example: 'Restauration et reboisement par les communautés' })
  @IsString()
  readonly title!: string;

  @ApiProperty({
    example: "Description détaillée de l'activité",
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly description?: string;
}
