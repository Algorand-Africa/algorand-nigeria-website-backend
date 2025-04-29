import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';
import { VoteType } from 'src/modules/forums/enum/vote-type.enum';

@Entity('post_votes')
export class PostVote extends BaseEntity {
  @Column({ type: 'varchar' })
  post_id: string;

  @Column({ type: 'varchar' })
  voter_id: string;

  @Column({ type: 'varchar' })
  vote_type: VoteType;
}
