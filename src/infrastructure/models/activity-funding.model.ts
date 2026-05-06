// src/infrastructure/models/activity-funding.model.ts  (NOUVELLE TABLE DE JOINTURE)
// Relie Activity <-> Funding en many-to-many explicite
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Activity } from './activity.model';
import { Funding } from './funding.model';

@Entity()
export class ActivityFunding {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @ManyToOne(() => Activity, (a) => a.activityFundings, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  activity?: Activity;

  @ManyToOne(() => Funding, (f) => f.activityFundings, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  funding?: Funding;

  @CreateDateColumn()
  createdAt?: Date;
}
