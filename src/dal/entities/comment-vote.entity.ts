import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';
import { VoteType } from 'src/modules/forums/enum/vote-type.enum';

@Entity('comment_votes')
export class CommentVote extends BaseEntity {
  @Column({ type: 'varchar' })
  comment_id: string;

  @Column({ type: 'varchar' })
  voter_id: string;

  @Column({ type: 'varchar' })
  vote_type: VoteType;
}
