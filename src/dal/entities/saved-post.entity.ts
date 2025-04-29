import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('saved_posts')
export class SavedPost extends BaseEntity {
  @Column({ type: 'varchar' })
  post_id: string;

  @Column({ type: 'varchar' })
  user_id: string;
}
