import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ActivityFunding } from './activity-funding.model';

@Entity()
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: 'varchar' })
  title?: string;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  @OneToMany(() => ActivityFunding, (af) => af.activity, { cascade: true })
  activityFundings?: ActivityFunding[];

  @CreateDateColumn()
  createdAt?: Date;
}
