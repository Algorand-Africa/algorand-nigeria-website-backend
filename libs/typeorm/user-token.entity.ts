import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Token } from './token.entity';
import { User } from './user.entity';

@Entity()
export class UserToken extends Token {
  @JoinColumn()
  @OneToOne(() => User, { eager: true })
  user: User;

  @Column()
  userId: string;
}
