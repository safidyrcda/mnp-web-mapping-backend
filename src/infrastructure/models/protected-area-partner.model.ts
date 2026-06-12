// src/infrastructure/models/protected-area-partner.model.ts
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProtectedArea } from './protected-area.model';
import { Partner } from './partner.model';

export enum PartnerType {
  TECHNICAL_PARTNER = 'technical_partner',
  STRATEGICAL_PARTNER = 'strategical_partner',
}

@Entity()
export class ProtectedAreaPartner {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @ManyToOne(() => ProtectedArea, { nullable: false, onDelete: 'CASCADE' })
  protectedArea?: ProtectedArea;

  @ManyToOne(() => Partner, { nullable: false, onDelete: 'CASCADE' })
  partner?: Partner;

  @Column({
    nullable: false,
    type: 'enum',
    enum: PartnerType,
  })
  type?: PartnerType;
}
