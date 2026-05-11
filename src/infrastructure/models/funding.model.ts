// src/infrastructure/models/funding.model.ts
// AVANT : un seul protectedArea (ManyToOne)
// APRÈS  : plusieurs APs via ProtectedAreaFunding + amountInEuro + disbursements
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from './project.model';
import { FunderFunding } from './funding-funder.model';
import { ProtectedAreaFunding } from './protected-area-funding.model';
import { Disbursement } from './disbursement.model';
import { ActivityFunding } from './activity-funding.model';

@Entity()
export class Funding {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true, type: 'varchar' })
  name?: string;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  // Relation many-to-many avec ProtectedArea via table de jointure explicite
  @OneToMany(() => ProtectedAreaFunding, (paf) => paf.funding, {
    cascade: true,
  })
  protectedAreaFundings?: ProtectedAreaFunding[];

  @ManyToOne(() => Project, (project) => project.id, { nullable: true })
  project?: Project;

  @Column({ nullable: true, type: 'date' })
  debut?: Date;

  @Column({ nullable: true, type: 'date' })
  end?: Date;

  @Column({ nullable: true, type: 'float' })
  amount?: number;

  @Column({ nullable: true, type: 'varchar' })
  currency?: string;

  // Montant converti en Euro (calculé ou saisi manuellement)
  @Column({ nullable: true, type: 'float' })
  amountInEuro?: number;

  @CreateDateColumn()
  createdAt?: Date;

  @OneToMany(() => FunderFunding, (ff) => ff.funding, { cascade: true })
  funderFundings?: FunderFunding[];

  @OneToMany(() => Disbursement, (d) => d.funding, { cascade: true })
  disbursements?: Disbursement[];

  // Relation many-to-many avec Activity via table de jointure explicite
  @OneToMany(() => ActivityFunding, (af) => af.funding, { cascade: true })
  activityFundings?: ActivityFunding[];
}
