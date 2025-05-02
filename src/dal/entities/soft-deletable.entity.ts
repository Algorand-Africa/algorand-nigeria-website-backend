import { Column } from 'typeorm';
import { BaseEntity } from './base.entity';

export abstract class SoftDeletableEntity extends BaseEntity {
  @Column({ type: 'timestamptz', nullable: true })
  deleted_at: Date | null;
}
