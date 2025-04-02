import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class ObjectIdDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
