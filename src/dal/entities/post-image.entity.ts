import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('post_images')
export class PostImage extends BaseEntity {
  @Column({ type: 'varchar' })
  post_id: string;

  @Column({ type: 'varchar' })
  image_url: string;
}
