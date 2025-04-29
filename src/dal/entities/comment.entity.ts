import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('comments')
export class Comment extends BaseEntity {
  @Column({ type: 'varchar' })
  message: string;

  @Column({ default: 0 })
  upvotes: number;

  @Column({ default: 0 })
  downvotes: number;

  @Column({ default: false })
  answered: boolean;

  @Column({ type: 'varchar' })
  category_id: string;

  @Column({ type: 'varchar' })
  commenter_id: string;

  @Column({ type: 'varchar', nullable: true })
  parent_id: string;
}
