import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerEnquiry, User } from 'src/dal/entities';
import {
  CreateCustomerEnquiryDto,
  UpdateCustomerEnquiryDto,
  CustomerEnquiryDto,
  CustomerEnquiryQueryDto,
} from '../dto/customer-enquiry.dto';
import { EnquiryStatus } from '../enums/enquiry-status.enum';
import { PaginatedResponse } from 'src/modules/core';

@Injectable()
export class CustomerEnquiryService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(CustomerEnquiry)
    private readonly customerEnquiryRepository: Repository<CustomerEnquiry>,
  ) {}

  async getAllCustomerEnquiries(
    options: CustomerEnquiryQueryDto,
  ): Promise<PaginatedResponse<CustomerEnquiryDto>> {
    const { page, pageSize, skip, search, status } = options;

    const qb =
      this.customerEnquiryRepository.createQueryBuilder('customer_enquiry');

    if (status) {
      qb.andWhere('customer_enquiry.status = :status', { status });
    }

    if (search) {
      qb.andWhere(
        'customer_enquiry.message ILIKE :search OR customer_enquiry.full_name ILIKE :search OR customer_enquiry.email ILIKE :search OR customer_enquiry.enquiry_type ILIKE :search',
        {
          search: `%${search}%`,
        },
      );
    }

    qb.skip(skip).take(pageSize);

    const [data, total] = await qb.getManyAndCount();

    return new PaginatedResponse(
      data.map((e) => ({
        id: e.id,
        fullName: e.full_name,
        email: e.email,
        phone: e.phone,
        message: e.message,
        enquiryType: e.enquiry_type,
        status: e.status,
      })),
      total,
      page,
      pageSize,
    );
  }

  async createCustomerEnquiry(
    createCustomerEnquiryDto: CreateCustomerEnquiryDto,
    userId?: string,
  ): Promise<CustomerEnquiry> {
    const { message, enquiry_type } = createCustomerEnquiryDto;

    let { full_name, email, phone } = createCustomerEnquiryDto;

    if (!userId) {
      if (!full_name || !email || !phone) {
        throw new BadRequestException(
          'Full name, email and phone are required',
        );
      }
    } else {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        throw new BadRequestException('User not found');
      }
      full_name = user.full_name;
      email = user.email;
      phone = user.phone || '';
    }

    const customerEnquiry = this.customerEnquiryRepository.create({
      full_name,
      email,
      phone,
      message,
      enquiry_type,
      status: EnquiryStatus.PENDING,
    });

    return this.customerEnquiryRepository.save(customerEnquiry);
  }

  async updateCustomerEnquiry(
    id: string,
    updateCustomerEnquiryDto: UpdateCustomerEnquiryDto,
  ): Promise<CustomerEnquiry> {
    const customerEnquiry = await this.customerEnquiryRepository.findOne({
      where: { id },
    });
    if (!customerEnquiry) {
      throw new BadRequestException('Customer enquiry not found');
    }

    customerEnquiry.status = updateCustomerEnquiryDto.status;

    return this.customerEnquiryRepository.save(customerEnquiry);
  }
}
