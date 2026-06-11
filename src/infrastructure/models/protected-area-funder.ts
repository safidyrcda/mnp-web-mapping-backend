import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProtectedArea } from './protected-area.model';
import { Funder } from './funder.model';

export enum ProtectedAreaFunderType {
  FUNDER = 'funder',
  TECHNICAL_PARTNER = 'technical_partner',
  STRATEGICAL_PARTNER = 'strategical_partner',
}

@Entity()
export class ProtectedAreaFunder {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @ManyToOne(() => ProtectedArea, { nullable: false, onDelete: 'CASCADE' })
  protectedArea?: ProtectedArea;

  @ManyToOne(() => Funder, { nullable: false, onDelete: 'CASCADE' })
  funder?: Funder;

  @Column({
    nullable: true,
    type: 'enum',
    enum: ProtectedAreaFunderType,
  })
  type?: ProtectedAreaFunderType;
}
