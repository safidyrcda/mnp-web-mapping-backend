// src/infrastructure/models/protected-area-partner.model.ts
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProtectedArea } from './protected-area.model';
import { Partner } from './partner.model';
import { Funder } from './funder.model';

export enum PartnerType {
  TECHNICAL_PARTNER = 'technical_partner',
  STRATEGICAL_PARTNER = 'strategical_partner',
}

@Entity()
export class ProtectedAreaPartner {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @ManyToOne(() => ProtectedArea, { nullable: true, onDelete: 'CASCADE' })
  protectedArea?: ProtectedArea;

  @ManyToOne(() => Partner, { nullable: true, onDelete: 'CASCADE' })
  partner?: Partner;

  @Column({
    nullable: true,
    type: 'enum',
    enum: PartnerType,
  })
  type?: PartnerType;

  @ManyToOne(() => Funder, (f) => f.fundings, { nullable: true })
  @JoinColumn({ name: 'funderId' })
  funder?: Funder;
}
