import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('multisigs')
export class Multisig extends BaseEntity {
  @Column({ type: 'varchar' })
  multisig_address: string;

  @Column({ type: 'varchar' })
  multisig_name: string;

  @Column({ type: 'varchar' })
  multisig_description: string;

  @Column({ nullable: false, type: 'jsonb', default: [] })
  multisig_members: string[];

  @Column({ type: 'int' })
  multisig_threshold: number;
}
