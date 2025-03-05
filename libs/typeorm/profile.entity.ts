import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity } from 'typeorm';
import { BaseWithExclusion } from './base-with-exclusion';

@Entity()
export class Profile extends BaseWithExclusion {
  @ApiProperty({
    type: String,
  })
  @Column({
    nullable: true,
    type: String,
  })
  name?: string;

  @ApiProperty({
    type: String,
  })
  @Column({
    nullable: true,
    type: String,
  })
  dob?: string;

  @ApiProperty({
    type: String,
  })
  @Column({
    nullable: true,
    type: String,
  })
  image: string;

  @ApiProperty({
    type: String,
  })
  @Exclude()
  @Column({
    nullable: true,
    type: String,
  })
  imageKey: string;

  @ApiProperty()
  @Column({
    nullable: true,
    type: String,
  })
  algoWalletAddress: string;

  @ApiProperty()
  @Column({
    type: String,
    default: '',
    nullable: false,
  })
  phoneNo: string;
}
