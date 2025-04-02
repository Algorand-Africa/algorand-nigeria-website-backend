import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEventStatus } from 'src/modules/events/constants/enums';
@Entity('event_registrations')
export class EventRegistration extends BaseEntity {
  @Column({ type: 'uuid' })
  event_id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({
    type: 'varchar',
    nullable: false,
    default: UserEventStatus.REGISTERED,
  })
  status: UserEventStatus;
}
