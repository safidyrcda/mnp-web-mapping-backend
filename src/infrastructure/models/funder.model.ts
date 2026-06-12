// src/infrastructure/models/funder.model.ts
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FunderFunding } from './funding-funder.model';
import { Funding } from './funding.model';

@Entity()
export class Funder {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true, type: 'varchar' })
  name?: string;

  @Column({ nullable: true, type: 'text' })
  fullname?: string;

  @OneToMany(() => Funding, (ff) => ff.funder)
  fundings?: Funding[];
  @OneToMany(() => FunderFunding, (ff) => ff.funder)
  funderFunding?: FunderFunding[];
}
