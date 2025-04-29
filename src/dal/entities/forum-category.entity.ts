import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum CategoryVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

@Entity('forum_categories')
export class ForumCategory extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  color: string;

  @Column({ type: 'varchar', nullable: true })
  text_color: string;

  @Column({ type: 'varchar', nullable: true })
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
