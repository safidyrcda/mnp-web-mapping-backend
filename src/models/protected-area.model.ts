import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProtectedArea {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  sigle: string;

  @Column('geometry', { nullable: true })
  geometry: Record<string, unknown>;

  @Column('float', { nullable: true })
  size: number;

  @Column({ nullable: true, type: 'varchar' })
  name: string;
}
