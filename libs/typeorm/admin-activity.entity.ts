import { Column, Entity } from 'typeorm';
import { Base } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class AdminActivity extends Base {
  @ApiProperty()
  @Column({
    nullable: false,
    default: '',
  })
  adminId: string;

  @ApiProperty()
  @Column({
    nullable: false,
    default: '',
  })
  description: string;

  @ApiProperty()
  @Column({
    nullable: false,
    default: 200,
  })
  statusCode: number;

  @ApiProperty()
  @Column({
    nullable: false,
    default: '',
  })
  url: string;

  @ApiProperty()
  @Column({
    nullable: true,
    type: 'jsonb',
  })
  payload: any;

  @ApiProperty()
  @Column({
    nullable: false,
    default: '',
  })
  method: string;

  @ApiProperty()
  @Column({
    nullable: true,
    type: 'jsonb',
  })
  headers: any;
}
