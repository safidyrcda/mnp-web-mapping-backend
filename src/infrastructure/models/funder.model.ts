import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FunderFunding } from './funding-funder.model';

@Entity()
export class Funder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, type: 'varchar' })
  name: string;

  @Column({ nullable: true, type: 'text' })
  fullname: string;

  @OneToMany(() => FunderFunding, (ff) => ff.funder)
  funderFunding: FunderFunding[];
}
