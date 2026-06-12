// src/infrastructure/models/partner.model.ts
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProtectedAreaPartner } from './protected-area-partner.model';

@Entity()
export class Partner {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true, type: 'varchar' })
  name?: string;

  @Column({ nullable: true, type: 'text' })
  fullname?: string;

  @OneToMany(() => ProtectedAreaPartner, (pap) => pap.partner)
  protectedAreaPartners?: ProtectedAreaPartner[];
}
