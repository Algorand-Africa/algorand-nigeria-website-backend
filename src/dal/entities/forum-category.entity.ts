import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum CategoryVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

@Entity('forum_categories')
export class ForumCategory extends BaseEntity {
  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 50, nullable: true })
  color: string;

  @Column({ nullable: true })
  image: string;

  @Column({
    type: 'varchar',
  })
  visibility: CategoryVisibility;

  @Column({ type: 'varchar', unique: true })
  slug: string;

  @Column({ type: 'varchar' })
  creator_id: string;
}
