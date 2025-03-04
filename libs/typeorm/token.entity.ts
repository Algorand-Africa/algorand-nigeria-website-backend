import { Column } from 'typeorm';
import { Base } from './base.entity';

export abstract class Token extends Base {
  @Column()
  token: string;

  @Column()
  expiryDate: Date;
}
