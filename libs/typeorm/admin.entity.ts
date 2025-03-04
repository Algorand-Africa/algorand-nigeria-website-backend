import { Column, Entity, ManyToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Base } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Profile } from '../interfaces';
import { Role } from './role.entity';

@Entity()
export class Admin extends Base {
  @ApiProperty()
  @Column({
    nullable: false,
    default: '',
  })
  email: string;

  @Exclude()
  @Column({
    nullable: false,
    default: '',
  })
  password: string;

  @ApiProperty()
  @Column({
    nullable: true,
    type: 'jsonb',
  })
  profile: Profile;

  @ManyToOne(() => Role, (role) => role.admins, { nullable: true })
  role: Role;

  @Column({ nullable: true })
  roleId: string;
}
