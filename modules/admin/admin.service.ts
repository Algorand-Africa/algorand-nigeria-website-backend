import {
  Injectable,
  ConflictException,
  Logger,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin, Otp } from 'libs/typeorm';
import {
  CreateAdminDto,
  DownloadAdminsInfoDto,
  PageDto,
  PageMetaDto,
  PageOptionsDto,
  UpdateAdminDto,
  UpdateAdminPasswordDto,
  UpdateAdminProfileDto,
  UploadImageDto,
} from 'libs/dto';
import { ERROR } from 'libs/enums';
import { BcryptService } from 'libs/injectables';
import { UserService } from 'modules/user/user.service';
import { RoleService } from 'modules/role/role.service';
import { SendgridService } from 'modules/sendgrid/sendgrid.service';
import { createPageOptionFallBack } from 'libs/utils';
import { FileUploadService } from 'modules/file-upload/file-upload.service';
import { Response } from 'express';
import { PDFService } from 'libs/helpers/pdf.service';
import { CsvService } from 'libs/helpers';
import { unlinkSync } from 'fs';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
    private readonly bcryptService: BcryptService,
    private readonly normalUserService: UserService,
    private readonly roleService: RoleService,
    private readonly sendgridService: SendgridService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async createAdmin(createAdminDto: CreateAdminDto) {
    const { email, password, roleId, name } = createAdminDto;

    if (await this.adminRepository.findOneBy({ email })) {
      throw new ConflictException(ERROR.EMAIL_EXISTS);
    }

    await this.roleService.getRoleById(roleId);

    const newAdmin = this.adminRepository.create({
      email,
      roleId,
      profile: { name },
      password: await this.bcryptService.hash(password),
    });

    return this.adminRepository.save(newAdmin);
  }

  async updateAdminProfile(id: string, updateAdminDto: UpdateAdminProfileDto) {
    const { name } = updateAdminDto;
    const admin = await this.findAdminById(id);

    if (name !== undefined && name.trim() !== '') {
      if (admin.profile) {
        admin.profile.name = name;
      } else {
        admin.profile = { name };
      }
    }

    const newAdmin = await this.adminRepository.save(admin);

    return newAdmin;
  }

  async updateAdmin(id: string, updateAdminDto: UpdateAdminDto) {
    let { roleId } = updateAdminDto;
    const admin = await this.findAdminById(id);

    if (!roleId || roleId.trim() === '') {
      roleId = admin.roleId;
    }

    const newRole = await this.roleService.getRoleById(roleId);
    admin.roleId = roleId;
    admin.role = newRole;

    if (
      updateAdminDto.name !== undefined &&
      updateAdminDto.name.trim() !== ''
    ) {
      if (admin.profile) {
        admin.profile.name = updateAdminDto.name;
      } else {
        admin.profile = { name: updateAdminDto.name };
      }
    }

    const newAdmin = await this.adminRepository.save(admin);

    return newAdmin;
  }

  async findAdminByEmail(email: string) {
    const admin = await this.adminRepository.findOneBy({ email });

    if (!admin) {
      throw new NotFoundException('Admin does not exist');
    }

    return admin;
  }

  async getAllAdmins(pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.adminRepository.createQueryBuilder('admin');

    const pageOptionsDtoFallBack = createPageOptionFallBack(pageOptionsDto);
    const { order, skip, numOfItemsPerPage } = pageOptionsDtoFallBack;

    queryBuilder
      .orderBy('admin.createdAt', order)
      .leftJoinAndSelect('admin.role', 'role')
      .skip(skip)
      .take(numOfItemsPerPage);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto: pageOptionsDtoFallBack,
    });

    return new PageDto(entities, pageMetaDto);
  }

  async findAdminById(id: string) {
    const admin = await this.adminRepository.findOne({
      where: { id },
      relations: { role: true },
    });
    if (!admin) {
      throw new NotFoundException('Admin does not exist');
    }
    return admin;
  }

  async deleteAdmin(id: string) {
    const admin = await this.findAdminById(id);

    const deletedAdmin = await this.adminRepository.remove(admin);

    return {
      status: 200,
      description: 'Admin has been deleted successfully.',
      admin: deletedAdmin,
    };
  }

  async getAdminPermissions(adminId: string) {
    const admin = await this.adminRepository.findOne({
      where: { id: adminId },
      relations: ['role'],
    });

    if (!admin) {
      throw new NotFoundException('Admin does not exist');
    }

    return admin.role.permissions;
  }

  async updateAdminPassword(
    adminId: string,
    updateAdminPasswordDto: UpdateAdminPasswordDto,
  ) {
    const { otp, password, confirmPassword } = updateAdminPasswordDto;
    const admin = await this.findAdminById(adminId);

    const existingOtp = await this.otpRepository.findOneBy({ adminId });

    if (!existingOtp) {
      throw new NotFoundException('No OTP found for the given adminId');
    }

    const currentTime = new Date();

    if (currentTime > existingOtp.expirationTime) {
      throw new BadRequestException('OTP has expired');
    }

    if (otp !== existingOtp.value) {
      throw new BadRequestException('Invalid OTP');
    }

    if (password !== confirmPassword) {
      throw new BadRequestException("Password doesn't match");
    }

    const hashPassword = await this.bcryptService.hash(password);

    admin.password = hashPassword;
    await this.adminRepository.save(admin);

    await this.otpRepository.remove(existingOtp);

    return { message: 'Password updated successfully' };
  }

  async uploadProfileImage(adminId: string, data: UploadImageDto) {
    try {
      const { base64 } = data;
      const admin = await this.findAdminById(adminId);
      const imageData = await this.fileUploadService.uploadProfilePhoto(
        admin.profile.imageKey || '',
        base64,
      );

      if (!imageData) throw new Error();

      const { image, imageKey } = imageData;

      if (!admin.profile) {
        admin.profile = { image, imageKey };
        await this.adminRepository.save(admin);
      } else {
        admin.profile.image = image !== null ? image : admin.profile.image;
        admin.profile.imageKey =
          imageKey !== null ? imageKey : admin.profile.imageKey;
        await this.adminRepository.save(admin);
      }

      return { message: 'File Upload was successful' };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('File upload failed');
    }
  }

  async downloadAdminsInfo(
    pageOptions: DownloadAdminsInfoDto,
    response: Response,
  ) {
    const queryBuilder = this.adminRepository.createQueryBuilder('admin');

    const pageOptionsDtoFallBack = createPageOptionFallBack(pageOptions);
    const { order } = pageOptionsDtoFallBack;

    queryBuilder
      .orderBy('admin.createdAt', order)
      .leftJoinAndSelect('admin.role', 'role');

    const { entities } = await queryBuilder.getRawAndEntities();

    const headers = ['Email', 'Name', 'Role', 'Role Description'];

    const data = entities.map((admin) => ({
      Email: admin.email,
      Name: admin.profile?.name,
      Role: admin.role?.name,
      'Role Description': admin.role?.description,
    }));

    const fileName = `admin-users-${new Date().toISOString()}`;

    let filePath = '';

    if (pageOptions.format === 'pdf') {
      const pdfServce = new PDFService();
      const res = await pdfServce.generatePdfTable(
        'Admin Users Data',
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

    response.download(filePath, `${fileName}.${pageOptions.format}`, (err) => {
      if (err) {
        this.logger.error(err);
        throw new InternalServerErrorException('Error generating file');
      }

      unlinkSync(filePath);
    });
  }
}
