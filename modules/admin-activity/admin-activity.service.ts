import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AdminActivityDto,
  AdminActivityPageOptionsDto,
  CreateAdminActivityDto,
  DownloadAdminActivityLogDto,
  PageDto,
  PageMetaDto,
} from 'libs/dto';
import { Admin } from '../../libs/typeorm';
import { AdminActivity } from '../../libs/typeorm/admin-activity.entity';
import { createPageOptionFallBack } from 'libs/utils';
import { Repository } from 'typeorm';
import { AdminActivityLoggerParams } from 'libs/interfaces';
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from 'date-fns';
import {
  formatDate,
  getStatusMappedValues,
  toAdminActivityResponseDto,
} from 'libs/mappers/admin.mapper';
import { unlinkSync } from 'fs';
import { CsvService } from 'libs/helpers';
import { PDFService } from 'libs/helpers/pdf.service';
import { Response } from 'express';

@Injectable()
export class AdminActivityService {
  private readonly logger = new Logger(AdminActivityService.name);

  constructor(
    @InjectRepository(AdminActivity)
    private readonly adminActivityRepository: Repository<AdminActivity>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async create(activity: CreateAdminActivityDto): Promise<AdminActivity> {
    try {
      const { description, statusCode, request } = activity;
      const { url, method, headers, body } = request;

      this.logger.log(
        `Recording admin activity: "${description}" by ${request.user?.id}`,
      );

      return this.adminActivityRepository.save({
        adminId: request.user?.id || '',
        description,
        statusCode,
        url,
        method,
        headers,
        payload: body,
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  async getAllActivities(
    pageOptionsDto: AdminActivityPageOptionsDto,
  ): Promise<PageDto<AdminActivityDto>> {
    const pageOptionsDtoFallBack = createPageOptionFallBack(pageOptionsDto);
    const qb = this.adminActivityRepository.createQueryBuilder('activity');

    qb.orderBy('activity."createdAt"', pageOptionsDtoFallBack.order);

    if (pageOptionsDto.startDate) {
      qb.andWhere('activity."createdAt" >= :startDate', {
        startDate: pageOptionsDto.startDate,
      });
    }

    if (pageOptionsDto.endDate) {
      qb.andWhere('activity."createdAt" <= :endDate', {
        endDate: pageOptionsDto.endDate,
      });
    }

    if (pageOptionsDto.adminId) {
      qb.andWhere('activity."adminId" = :adminId', {
        adminId: pageOptionsDto.adminId,
      });
    }

    if (pageOptionsDto.searchTerm) {
      qb.andWhere(
        'activity."description" ILIKE :searchTerm OR activity."url" ILIKE :searchTerm',
        { searchTerm: `%${pageOptionsDto.searchTerm}%` },
      );
    }

    qb.offset(pageOptionsDtoFallBack.skip).limit(
      pageOptionsDtoFallBack.numOfItemsPerPage,
    );

    qb.leftJoinAndSelect(
      Admin,
      'admin',
      'admin.id::text = activity."adminId"::text',
    );
    qb.addSelect('admin.email', 'adminEmail');
    qb.addSelect('admin.profile', 'adminProfile');

    const [entities, itemCount] = await Promise.all([
      qb.getRawMany(),
      qb.getCount(),
    ]);

    const adminActivities = entities.map((adminActivity) =>
      toAdminActivityResponseDto(adminActivity),
    );

    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto: pageOptionsDtoFallBack,
    });

    return new PageDto(adminActivities, pageMetaDto);
  }

  async getActivityById(id: string): Promise<AdminActivityDto> {
    const activity = await this.adminActivityRepository.findOneBy({ id });

    if (!activity) throw new NotFoundException('Activity not found');

    const admin = await this.adminRepository.findOne({
      where: { id: activity.adminId },
    });

    if (!admin) {
      return {
        ...activity,
        adminName: 'Admin not found',
        adminEmail: '',
        adminImage: null,
      };
    }

    return {
      ...activity,
      adminName: admin.profile?.name || '',
      adminImage: admin?.profile?.image || '',
      adminEmail: admin.email,
    };
  }

  async logActivity<T = any>(params: AdminActivityLoggerParams): Promise<T> {
    const { description, request, callback } = params;

    try {
      const res = await callback();

      this.create({
        description,
        statusCode: 200,
        request,
      });

      return res;
    } catch (error) {
      const statusCode = error.status || 500;

      this.create({
        description,
        statusCode,
        request,
      });

      if (statusCode === 404) {
        throw new NotFoundException(error.message || 'Resource not found');
      }

      if (statusCode === 403) {
        throw new ForbiddenException(error.message || 'Forbidden');
      }

      if (statusCode === 500) {
        throw new InternalServerErrorException(
          error.message || 'Internal Server Error',
        );
      }

      if (statusCode === 400) {
        throw new Error(error.message || 'Bad Request');
      }

      throw new Error(error);
    }
  }

  async downloadAdminActivityLogs(
    pageOptionsDto: DownloadAdminActivityLogDto,
    response: Response,
  ) {
    const queryBuilder = this.adminActivityRepository
      .createQueryBuilder('activity')
      .select([
        'activity.description as description',
        'activity."createdAt" as "createdAt"',
        'activity."statusCode" as "statusCode"',
      ]);
    const today = new Date();

    const pageOptionsDtoFallBack = createPageOptionFallBack(pageOptionsDto);

    const datePeriodMap = {
      TODAY: [startOfDay(today), endOfDay(today)],
      WEEKLY: [startOfWeek(today), endOfWeek(today)],
      MONTHLY: [startOfMonth(today), endOfMonth(today)],
      YEARLY: [startOfYear(today), endOfYear(today)],
      ALL: null,
    };

    const dateRange = datePeriodMap[pageOptionsDto.datePeriod];

    queryBuilder.orderBy('activity.createdAt', pageOptionsDtoFallBack.order);

    if (dateRange) {
      queryBuilder.where('activity.createdAt BETWEEN :start AND :end', {
        start: dateRange[0],
        end: dateRange[1],
      });
    }

    if (pageOptionsDto.adminId) {
      queryBuilder.andWhere('activity."adminId" = :adminId', {
        adminId: pageOptionsDto.adminId,
      });
    }

    if (pageOptionsDto.searchTerm) {
      queryBuilder.andWhere(
        'activity."description" ILIKE :searchTerm OR activity."url" ILIKE :searchTerm',
        { searchTerm: `%${pageOptionsDto.searchTerm}%` },
      );
    }

    queryBuilder.leftJoinAndSelect(
      Admin,
      'admin',
      'admin.id::text = activity."adminId"::text',
    );
    queryBuilder.addSelect('admin.email', 'adminEmail');
    queryBuilder.addSelect('admin.profile', 'adminProfile');

    const entities = await queryBuilder.getRawMany();

    const headers = ['Email', 'Name', 'Description', 'Date', 'Status'];

    const data = entities.map((entity) => ({
      Email: entity.adminEmail || 'Admin not found',
      Name: entity.adminProfile?.name || 'Admin not found',
      Description: entity.description,
      Date: formatDate(entity.createdAt),
      Status: getStatusMappedValues(entity.statusCode),
    }));

    const fileName = `activity-log-${new Date().toISOString()}`;

    let filePath = '';

    if (pageOptionsDto.format === 'pdf') {
      const pdfServce = new PDFService();
      const res = await pdfServce.generatePdfTable(
        'Activity Logs',
        headers,
        data,
        fileName,
      );
      const { path, status } = res;

      if (status === 'failed') {
        throw new InternalServerErrorException('Error generating PDF file');
      }

      filePath = path;
    } else {
      const csvService = new CsvService();
      const res = await csvService.generateCsv(headers, data, fileName);
      const { path, status } = res;
      if (status === 'failed') {
        throw new InternalServerErrorException('Error generating CSV file');
      }
      filePath = path;
    }

    response.download(
      filePath,
      `${fileName}.${pageOptionsDto.format}`,
      (err) => {
        if (err) {
          this.logger.error(err);
          throw new InternalServerErrorException('Error generating file');
        }
        unlinkSync(filePath);
      },
    );
  }
}
