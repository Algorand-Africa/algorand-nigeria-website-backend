import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { RoleType } from '../../modules/users/enums/role-type.enum';
import { UserStatus } from '../../modules/users/enums/user-status.enum';
import { BaseEntity } from './base.entity';
import { DEFAULT_USER_PREFERENCE } from 'src/modules/users/constants/user-preference';
import { UserPreferenceDto } from 'src/modules/users/dto/user-preference.dto';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  full_name: string;

  @Column({ type: 'varchar' })
  username: string;

  @Column({ unique: true, type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: RoleType.USER,
    transformer: {
      to: (value: RoleType) => value,
      from: (value: string) => value as RoleType,
    },
  })
  role: RoleType;

  @Column({ nullable: true, type: 'timestamptz' })
  email_verified_at?: Date;

  @Column({
    type: 'varchar',
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({ nullable: true, type: 'timestamp' })
  last_login_at?: Date;

  @Column({ nullable: true, type: 'varchar' })
  phone?: string;

  @Column({ nullable: true, type: 'varchar' })
  profile_picture_url?: string;

  @Column({ nullable: true, type: 'jsonb', default: DEFAULT_USER_PREFERENCE })
  preferences?: UserPreferenceDto;
}
