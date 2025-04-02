import { ApiProperty } from '@nestjs/swagger';
import { PageOptionsDto } from './page-options.dto';

export class PageDto<T> {
  @ApiProperty()
  readonly data: T[];

  @ApiProperty()
  readonly total: number;

  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly page_size: number;

  @ApiProperty()
  readonly has_next: boolean;

  constructor(data: T[], total: number, pageOptions: PageOptionsDto) {
    this.total = total;
    this.data = data;
    this.page = pageOptions.page || 1;
    this.page_size = pageOptions.take;
    this.has_next = this.page * this.page_size < this.total;
  }
}
