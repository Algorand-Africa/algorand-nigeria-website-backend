import { ApiProperty } from '@nestjs/swagger';

export class Profile {
  @ApiProperty({
    type: String,
  })
  name?: string | null;

  @ApiProperty({
    type: String,
  })
  githubUsername?: string | null;

  @ApiProperty({
    type: String,
  })
  dob?: string | null;

  @ApiProperty({
    nullable: true,
    type: String,
  })
  image?: string;

  @ApiProperty({
    type: String,
  })
  @ApiProperty({
    nullable: true,
    type: String,
  })
  imageKey?: string;
}
