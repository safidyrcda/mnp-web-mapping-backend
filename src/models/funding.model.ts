import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Funder } from './funder.model';
import { ProtectedArea } from './protected-area.model';
import { Project } from './project.model';

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
}
