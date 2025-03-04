import {
  Controller,
  Get,
  Param,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Permissions } from 'libs/decorators/permissions.decorator';
import { AdminJwtAuthGuard } from 'libs/guards/jwt/admin-jwt-auth.guard';
import { RbacGuard } from 'libs/guards/jwt/rbac.guard';
import { PERMISSION } from 'libs/enums';
import { AdminActivityService } from 'modules/admin-activity/admin-activity.service';
import {
  AdminActivityDto,
  AdminActivityPageOptionsDto,
  AdminActivityPaginationDto,
  DownloadAdminActivityLogDto,
} from 'libs/dto';
import { Response } from 'express';
import { RequestDto } from 'libs/dto/request.dto';

@ApiTags('Admin Activity Manager')
@Controller('admin-activity')
export class AdminActivityController {
  constructor(private adminActivityService: AdminActivityService) {}

  @ApiBearerAuth('Bearer')
  @ApiOperation({
    summary: 'This downloads the details of all admin activities.',
  })
  @UseGuards(AdminJwtAuthGuard, RbacGuard)
  @Permissions(PERMISSION.VIEW_ADMIN_ACTIVITY)
  @Get('/download-activity-log')
  async getAdminActivityLog(
    @Res() res: Response,
    @Request() request: RequestDto,
    @Query() pageOptions: DownloadAdminActivityLogDto,
  ) {
    const description = `Downloaded information of admin activity on the platform.`;

    return this.adminActivityService.logActivity({
      description,
      request,
      callback: async () => {
        return this.adminActivityService.downloadAdminActivityLogs(
          pageOptions,
          res,
        );
      },
    });
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({
    summary: 'This returns the details of all admin activities.',
  })
  @ApiResponse({ type: AdminActivityPaginationDto })
  @ApiQuery({ type: AdminActivityPageOptionsDto })
  @UseGuards(AdminJwtAuthGuard, RbacGuard)
  @Permissions(PERMISSION.VIEW_ADMIN_ACTIVITY)
  @Get('')
  async getAllAdminActivities(@Query() query: AdminActivityPageOptionsDto) {
    return this.adminActivityService.getAllActivities(query);
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({
    summary: 'This returns the details of an admin activity by id.',
  })
  @ApiResponse({ type: AdminActivityDto })
  @UseGuards(AdminJwtAuthGuard, RbacGuard)
  @Permissions(PERMISSION.VIEW_ADMIN_ACTIVITY)
  @Get('/:id')
  async getAdminActivityById(@Param('id') id: string) {
    return this.adminActivityService.getActivityById(id);
  }
}
