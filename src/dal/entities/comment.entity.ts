import { Entity, Column } from 'typeorm';
import { SoftDeletableEntity } from './soft-deletable.entity';

@Entity('comments')
export class Comment extends SoftDeletableEntity {
  @Column({ type: 'varchar' })
  message: string;

  @Column({ type: 'varchar' })
  post_id: string;

  @Column({ type: 'varchar' })
  commenter_id: string;

  @Column({ type: 'varchar', nullable: true })
  parent_id: string;
}
