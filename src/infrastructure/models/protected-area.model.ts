import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProtectedArea {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ unique: true })
  sigle?: string;

  @Column('geometry', { nullable: true })
  geometry?: Record<string, unknown>;

  @Column('float', { nullable: true })
  size?: number;

  @Column({ nullable: true, type: 'varchar' })
  name?: string;

  @Column({ nullable: true })
  status?: string;

  // ── Nouvelles colonnes ──────────────────────────────

  @Column('float', { nullable: true })
  superficie?: number;

  @Column({ nullable: true, type: 'int' })
  creationYear?: number;

  @Column({ nullable: true, type: 'text', array: true })
  regions?: string[];

  @Column({ nullable: true, type: 'text', array: true })
  districts?: string[];

  @Column({ nullable: true, type: 'text', array: true })
  communes?: string[];

  @Column({ nullable: true, type: 'int' })
  populationCount?: number;

  @Column({ nullable: true, type: 'int' })
  femaleClpNumber?: number;

  @Column({ nullable: true, type: 'int' })
  maleClpNumber?: number;
}
