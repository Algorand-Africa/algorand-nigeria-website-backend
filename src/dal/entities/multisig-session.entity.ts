import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('multisig-sessions')
export class MultisigSession extends BaseEntity {
  @Column({ type: 'varchar' })
  multisig_id: string;

  @Column({ type: 'varchar' })
  session_token: string;

  @Column({ type: 'jsonb', nullable: false, default: [] })
  txns: string[];

  @Column({ nullable: false, type: 'jsonb', default: [] })
  members_that_signed: string[];

  @Column({ type: 'int4' })
  minimum_signatures: number;
}
