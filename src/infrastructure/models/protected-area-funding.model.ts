import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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
}
