import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Funding } from './funding.model';

@Entity()
export class Disbursement {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: 'date' })
  date?: Date;

  @Column({ nullable: true, type: 'text' })
  note?: string;

  @Column({ nullable: true, type: 'float' })
  amount?: number;

  @Column({ nullable: true, type: 'varchar' })
  currency?: string;

  @Column({ nullable: true, type: 'float' })
  amountInEuro?: number;

  @ManyToOne(() => Funding, (f) => f.disbursements, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  funding?: Funding;

  @CreateDateColumn()
  createdAt?: Date;
}
