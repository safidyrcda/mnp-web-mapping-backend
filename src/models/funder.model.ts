import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Funder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, type: 'varchar' })
  name: string;
}
