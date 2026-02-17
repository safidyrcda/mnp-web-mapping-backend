import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Funder } from './funder.model';
import { Funding } from './funding.model';

@Entity()
export class FunderFunding {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Funder, (funder) => funder.id, { nullable: true })
  funder: Funder;

  @ManyToOne(() => Funding, (funding) => funding.id, { nullable: true })
  funding: Funding;

  @CreateDateColumn()
  createdAt: Date;
}
