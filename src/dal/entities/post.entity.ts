import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';
import { PostStatus } from 'src/modules/forums/enum/post-status.enum';

@Entity('posts')
export class Post extends BaseEntity {
  @Column({ type: 'varchar' })
  category_id: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  message: string;

  @Column({ type: 'varchar' })
  poster_id: string;

  @Column({ type: 'varchar', nullable: false, default: PostStatus.OPEN })
  status: PostStatus;
}
