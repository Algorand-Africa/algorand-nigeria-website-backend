import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/modules/auth/decorators';
import { RoleType } from 'src/modules/users/enums/role-type.enum';
import { CreateMultisigDto, MultisigDto } from '../dto/multisig.dto';
import { RolesGuard } from 'src/modules/auth/guards';
import { AdminMultisigService } from '../services/admin-multisig.service';

@ApiTags('Multisig management')
@ApiBearerAuth('Bearer')
@Controller('admin/multisig')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminMultisigController {
  constructor(private readonly multisigService: AdminMultisigService) {}

  @ApiOperation({ summary: 'Fetch all multisigs' })
  @ApiResponse({
    status: 200,
    description: 'All multisigs fetched successfully',
    type: MultisigDto,
    isArray: true,
  })
  @Roles(RoleType.SUPER_ADMIN)
  @Get()
  async getAllMultisigs() {
    return this.multisigService.getAllMultisigs();
  }

  @ApiOperation({ summary: 'Create a multisig' })
  @ApiResponse({
    status: 201,
    description: 'Multisig created successfully',
    type: MultisigDto,
  })
  @Roles(RoleType.SUPER_ADMIN)
  @Post()
  async createMultisig(@Body() dto: CreateMultisigDto) {
    return this.multisigService.createMultisig(dto);
  }

  @ApiOperation({ summary: 'Get a multisig by ID' })
  @ApiResponse({
    status: 200,
    description: 'Multisig fetched successfully',
    type: MultisigDto,
  })
  @Roles(RoleType.SUPER_ADMIN)
  @Get(':id')
  async getMultisigById(@Param('id') id: string) {
    return this.multisigService.getMultisigById(id);
  }

  @ApiOperation({ summary: 'Get a multisig by address' })
  @ApiResponse({
    status: 200,
    description: 'Multisig fetched successfully',
    type: MultisigDto,
  })
  @Roles(RoleType.SUPER_ADMIN)
  @Get('address/:address')
  async getMultisigByAddress(@Param('address') address: string) {
    return this.multisigService.getMultisigByAddress(address);
  }

  @ApiOperation({ summary: 'Delete a multisig' })
  @ApiResponse({
    status: 200,
    description: 'Multisig deleted successfully',
  })
  @Roles(RoleType.SUPER_ADMIN)
  @Delete(':id')
  async deleteMultisig(@Param('id') id: string) {
    return this.multisigService.deleteMultisig(id);
  }
}
