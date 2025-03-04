import { Column } from 'typeorm';
import { Base } from './base.entity';

export abstract class SoftDeletableEntity extends Base {
  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;
}
