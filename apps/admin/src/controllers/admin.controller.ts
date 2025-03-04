import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  ValidationPipe,
  UsePipes,
  Body,
  Param,
  Put,
  Delete,
  Patch,
  Query,
  Res,
} from '@nestjs/common';
import {
  CreateAdminDto,
  DownloadAdminsInfoDto,
  UpdateAdminDto,
  UpdateAdminPasswordDto,
  UpdateAdminProfileDto,
} from 'libs/dto/admin.dto';
import { Admin } from 'libs/typeorm';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AdminJwtAuthGuard } from 'libs/guards/jwt/admin-jwt-auth.guard';
import { AdminService } from 'modules/admin/admin.service';
import { PageOptionsDto, UploadImageDto } from 'libs/dto';
import { RequestDto } from 'libs/dto/request.dto';
import { RbacGuard } from 'libs/guards/jwt/rbac.guard';
import { Permissions } from 'libs/decorators/permissions.decorator';
import { PERMISSION } from 'libs/enums';
import { Response } from 'express';
import { AdminActivityService } from 'modules/admin-activity/admin-activity.service';

@ApiTags('Admin User Manager')
@Controller('admin')
export class AdminController {
  constructor(
    private adminService: AdminService,
    private adminActivityService: AdminActivityService,
  ) {}

  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'This returns the details of all admins.' })
  @ApiResponse({
    status: 200,
    description: 'Object containing admin details.',
    type: Admin,
    isArray: true,
  })
  @UseGuards(AdminJwtAuthGuard, RbacGuard)
  @Permissions(PERMISSION.VIEW_ADMINS)
  @Get('all')
  async getAllAdmins(@Query() options: PageOptionsDto) {
    return this.adminService.getAllAdmins(options);
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'This downloads the details of the admins.' })
  @UseGuards(AdminJwtAuthGuard, RbacGuard)
  @Permissions(PERMISSION.VIEW_ADMINS)
  @Get('download')
  async downloadAdmins(
    @Query() options: DownloadAdminsInfoDto,
    @Res() res: Response,
    @Request() request: RequestDto,
  ) {
    const description = `Downloaded the details of all admins.`;

    return this.adminActivityService.logActivity({
      description,
      request,
      callback: async () => {
        return this.adminService.downloadAdminsInfo(options, res);
      },
    });
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'This returns the details of the logged in admin.' })
  @ApiResponse({
    status: 200,
    description: 'Object containing admin details.',
    type: Admin,
  })
  @UseGuards(AdminJwtAuthGuard)
  @Get()
  async get(@Request() req: any): Promise<Admin> {
    const { id } = req.user;
    return this.adminService.findAdminById(id);
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'This creates a new admin.' })
  @ApiResponse({
    status: 200,
    description: 'Object containing new admin details.',
    type: Admin,
  })
  @ApiBody({ type: CreateAdminDto })
  @UseGuards(AdminJwtAuthGuard, RbacGuard)
  @Permissions(PERMISSION.CREATE_ADMIN)
  @Post('create')
  @UsePipes(ValidationPipe)
  createUsers(
    @Body() createAdminDto: CreateAdminDto,
    @Request() request: RequestDto,
  ) {
    const description = `Created a new admin with email address '${createAdminDto.email}'.`;

    return this.adminActivityService.logActivity({
      description,
      request: {
        ...request,
        body: {
          ...request.body,
          password: null,
          confirmPassword: null,
        },
        headers: request.headers,
      },
      callback: async () => {
        return this.adminService.createAdmin(createAdminDto);
      },
    });
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'This updates an existing admin.' })
  @ApiResponse({
    status: 200,
    description: 'Object containing updated admin details.',
    type: Admin,
  })
  @ApiBody({ type: UpdateAdminDto })
  @UseGuards(AdminJwtAuthGuard, RbacGuard)
  @Permissions(PERMISSION.EDIT_ADMIN)
  @Patch('update/:id')
  @UsePipes(ValidationPipe)
  updateAdmin(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
    @Request() request: RequestDto,
  ) {
    const description = `Updated the details of the admin with id ${id}`;

    return this.adminActivityService.logActivity({
      description,
      request,
      callback: async () => {
        return this.adminService.updateAdmin(id, updateAdminDto);
      },
    });
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'This deletes an existing admin.' })
  @ApiResponse({
    status: 200,
    description: 'Object containing deleted admin details.',
    type: Admin,
  })
  @UseGuards(AdminJwtAuthGuard, RbacGuard)
  @Permissions(PERMISSION.DELETE_ADMIN)
  @Delete('delete/:id')
  async deleteAdmin(@Param('id') id: string, @Request() request: RequestDto) {
    const description = `Deleted the admin with id ${id}`;

    return this.adminActivityService.logActivity({
      description,
      request,
      callback: async () => {
        return this.adminService.deleteAdmin(id);
      },
    });
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'This sends an OTP value to the admin email.' })
  @UseGuards(AdminJwtAuthGuard)
  @Post('request-password-reset')
  async resetPasswordEmail(@Request() request: RequestDto) {
    const { email } = request.user;
    const description = `Requested for a password reset OTP to be sent via mail.`;

    return this.adminActivityService.logActivity({
      description,
      request,
      callback: async () => {
        return { message: 'Password reset email sent' };
      },
    });
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({
    summary: 'This updates an existing admin password if otp matches.',
  })
  @UseGuards(AdminJwtAuthGuard)
  @UsePipes(ValidationPipe)
  @ApiResponse({
    status: 200,
    description: 'Object containing updated admin details.',
    type: Admin,
  })
  @Post('update-password')
  async updatePassword(
    @Request() request: RequestDto,
    @Body() updateAdminPasswordDto: UpdateAdminPasswordDto,
  ) {
    const { id } = request.user;
    const description = `Updated their password.`;

    return this.adminActivityService.logActivity({
      description,
      request: {
        ...request,
        body: {},
        headers: request.headers,
      },
      callback: async () => {
        return this.adminService.updateAdminPassword(
          id,
          updateAdminPasswordDto,
        );
      },
    });
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'This uploads the profile photo of a user.' })
  @ApiResponse({
    status: 200,
    description: 'Photo uploaded successfully.',
    type: Admin,
  })
  @ApiBody({ type: UploadImageDto })
  @UseGuards(AdminJwtAuthGuard)
  @Put('profile/upload-image')
  @UsePipes(ValidationPipe)
  async uploadProfileImage(
    @Request() request: RequestDto,
    @Body() data: UploadImageDto,
  ) {
    const { id } = request.user;
    const description = `Uploaded a profile photo to their profile.`;

    return this.adminActivityService.logActivity({
      description,
      request,
      callback: async () => {
        return this.adminService.uploadProfileImage(id, data);
      },
    });
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: "This updates an admin's profile." })
  @ApiResponse({
    status: 200,
    description: 'Object containing updated admin details.',
    type: Admin,
  })
  @ApiBody({ type: UpdateAdminProfileDto })
  @UseGuards(AdminJwtAuthGuard)
  @Patch('profile')
  @UsePipes(ValidationPipe)
  updateAdminProfile(
    @Request() request: RequestDto,
    @Body() updateAdminDto: UpdateAdminProfileDto,
  ) {
    const { id } = request.user;
    const description = `Updated their profile information.`;

    return this.adminActivityService.logActivity({
      description,
      request,
      callback: async () => {
        return this.adminService.updateAdmin(id, updateAdminDto);
      },
    });
  }
}
