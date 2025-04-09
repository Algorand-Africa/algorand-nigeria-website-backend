import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CustomerEnquiryService } from '../services/customer-enquiry.service';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import { OptionalJwtGuard } from 'src/modules/auth/guards/optional-jwt.guard';
import {
  CreateCustomerEnquiryDto,
  CustomerEnquiryQueryDto,
  UpdateCustomerEnquiryDto,
} from '../dto/customer-enquiry.dto';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { JwtAuthGuard, RolesGuard } from 'src/modules/auth/guards';
import { RoleType } from '../enums/role-type.enum';
import { Roles } from 'src/modules/auth/decorators';

@ApiTags('Customer Enquiry')
@Controller('customer-enquiry')
export class CustomerEnquiryController {
  constructor(
    private readonly customerEnquiryService: CustomerEnquiryService,
  ) {}

  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN, RoleType.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all customer enquiries' })
  @ApiResponse({
    status: 200,
    description: 'The customer enquiries have been successfully retrieved.',
  })
  @Get()
  async getAllCustomerEnquiries(@Query() query: CustomerEnquiryQueryDto) {
    return this.customerEnquiryService.getAllCustomerEnquiries(query);
  }

  @Public()
  @UseGuards(OptionalJwtGuard())
  @ApiOperation({ summary: 'Create a customer enquiry' })
  @ApiResponse({
    status: 201,
    description: 'The customer enquiry has been successfully created.',
  })
  @Post()
  async createCustomerEnquiry(
    @Body() createCustomerEnquiryDto: CreateCustomerEnquiryDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.customerEnquiryService.createCustomerEnquiry(
      createCustomerEnquiryDto,
      user?.id,
    );
  }

  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN, RoleType.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update a customer enquiry' })
  @ApiResponse({
    status: 200,
    description: 'The customer enquiry has been successfully updated.',
  })
  @Patch(':id')
  async updateCustomerEnquiry(
    @Param('id') id: string,
    @Body() updateCustomerEnquiryDto: UpdateCustomerEnquiryDto,
  ) {
    return this.customerEnquiryService.updateCustomerEnquiry(
      id,
      updateCustomerEnquiryDto,
    );
  }
}
