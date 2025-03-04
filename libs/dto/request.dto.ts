import { ApiProperty } from '@nestjs/swagger';

export class RequestDto {
  @ApiProperty()
  headers: Record<string, any>;

  @ApiProperty()
  method: string;

  @ApiProperty()
  body: any;

  @ApiProperty()
  url: string;

  @ApiProperty()
  user?: { id: string; email: string };
}
