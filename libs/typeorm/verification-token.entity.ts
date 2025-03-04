import { Column, Entity } from 'typeorm';
import { Base } from './base.entity';

@Entity()
export class VerificationToken extends Base {
  @Column()
  value: string;

  @Column()
  expirationTime: Date;

  @Column({ nullable: true })
  userId: string;
}
