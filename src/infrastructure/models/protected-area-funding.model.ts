import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Funding } from './funding.model';
import { ProtectedArea } from './protected-area.model';

@Entity()
export class ProtectedAreaFunding {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @ManyToOne(() => ProtectedArea, (pa) => pa.id, { nullable: false })
  protectedArea?: ProtectedArea;

  @ManyToOne(() => Funding, (f) => f.protectedAreaFundings, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  funding?: Funding;

  @Column('float', { nullable: true })
  amount?: number;

  @Column({ nullable: true, type: 'varchar' })
  currency?: string;

  @Column('float', { nullable: true })
  amountInEuro?: number;

  @Column({ nullable: true, type: 'varchar' })
  note?: string;
}
