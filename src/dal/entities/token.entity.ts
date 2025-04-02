import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

export enum TokenType {
  EMAIL_VERIFICATION = 'email_verification',
  PASSWORD_RESET = 'password_reset',
}

@Entity({ name: 'tokens' })
export class Token extends BaseEntity {
  @Column({ type: 'varchar' })
  code: string;

  @Column({
    type: 'varchar',
    nullable: false,
    default: TokenType.EMAIL_VERIFICATION,
  })
  type: TokenType;

  @Column({ type: 'timestamptz' })
  expires_at: Date;

  @Column({ type: 'boolean', default: false })
  is_used: boolean;

  @Column({ type: 'uuid' })
  user_id: string;
}
