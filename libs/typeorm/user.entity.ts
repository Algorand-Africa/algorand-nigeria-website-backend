import { Column, Entity, OneToOne, JoinColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Base } from './base.entity';
import { Profile } from './profile.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User extends Base {
  @ApiProperty()
  @Column({
    nullable: false,
    default: '',
  })
  email: string;

  @ApiProperty()
  @Column({
    nullable: false,
    default: '',
  })
  username: string;

  @Exclude()
  @Column({
    nullable: false,
    default: '',
  })
  password: string;

  @ApiProperty({
    type: Profile,
  })
  @OneToOne(() => Profile, { onDelete: 'CASCADE' })
  @JoinColumn()
  profile: Profile;

  @ApiProperty()
  @Column({
    type: Boolean,
    default: false,
    nullable: false,
  })
  isVerified: boolean;
}
