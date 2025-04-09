import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { EnquiryStatus } from 'src/modules/users/enums/enquiry-status.enum';

@Entity('customer_enquiries')
export class CustomerEnquiry extends BaseEntity {
  @Column({ type: 'varchar' })
  full_name: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  phone: string;

  @Column({ type: 'varchar' })
  message: string;

  @Column({ type: 'varchar' })
  enquiry_type: string;

  @Column({ type: 'varchar' })
  status: EnquiryStatus;
}
