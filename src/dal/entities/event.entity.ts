import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import {
  EventStatus,
  EventType,
  EventCategory,
} from 'src/modules/events/constants/enums';

@Entity('events')
export class Event extends BaseEntity {
  @Column({ type: 'varchar' })
  slug: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'varchar' })
  location: string;

  @Column({ type: 'varchar' })
  image: string;

  @Column({ type: 'timestamptz' })
  date: Date;

  @Column({ type: 'varchar' })
  category: EventCategory;

  @Column({ type: 'varchar' })
  type: EventType;

  @Column({ type: 'varchar' })
  status: EventStatus;

  @Column({ type: 'int4', nullable: true })
  smart_contract_id: number;

  @Column({ type: 'int4', nullable: true })
  asa_id: number;

  @Column({ type: 'varchar', nullable: true })
  event_summary: string;

  @Column({ type: 'jsonb', nullable: false, default: [] })
  image_gallery: string[];
}
