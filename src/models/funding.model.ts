import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Funder } from './funder.model';
import { ProtectedArea } from './protected-area.model';
import { Project } from './project.model';
import { FunderFunding } from './funding-funder.model';

@Entity()
export class Funding {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, type: 'varchar' })
  name: string;

  @ManyToOne(() => Funder, (funder) => funder.id, { nullable: true })
  funder: Funder;

  @ManyToOne(() => ProtectedArea, (protectedArea) => protectedArea.id, {
    nullable: true,
  })
  protectedArea: ProtectedArea;

  @ManyToOne(() => Project, (project) => project.id, {
    nullable: true,
  })
  project: Project;

  @Column({ nullable: true, type: 'date' })
  debut?: Date;

  @Column({ nullable: true, type: 'date' })
  end?: Date;

  @Column({ nullable: true, type: 'float' })
  amount?: number;

  @Column({ nullable: true })
  currency?: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => FunderFunding, (ff) => ff.funding, { cascade: true })
  funderFunding: FunderFunding[];
}
