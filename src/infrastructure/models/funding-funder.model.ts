import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Funder } from './funder.model';
import { Funding } from './funding.model';

export enum FunderFundingType {
  FUNDER = 'funder',
  TECHNICAL_PARTNER = 'technical_partner',
  STRATEGICAL_PARTNER = 'strategical_partner',
}

@Entity()
export class FunderFunding {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @ManyToOne(() => Funder, (f) => f.funderFunding, { nullable: false })
  funder?: Funder;

  @Column({
    nullable: true,
    type: 'enum',
    enum: FunderFundingType,
  })
  type?: FunderFundingType;
}
