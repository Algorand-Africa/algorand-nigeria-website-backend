import { Entity, Column, OneToMany } from 'typeorm';
import { Admin } from './admin.entity';
import { ApiProperty } from '@nestjs/swagger';
import { PERMISSION } from '../enums';
import { Base } from './base.entity';

@Entity()
export class Role extends Base {
  @ApiProperty({ description: 'The name of the role' })
  @Column({ nullable: false })
  name: string;

  @ApiProperty({ description: 'The description of the role' })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ isArray: true, enum: PERMISSION })
  @Column({ nullable: true, type: 'jsonb' })
  permissions: PERMISSION[];

  @ApiProperty({ description: 'The list of admins with this role' })
  @OneToMany(() => Admin, (admin) => admin.role)
  admins: Admin[];
}
