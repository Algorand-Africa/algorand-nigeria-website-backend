import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from 'modules/admin/admin.service';
import { Admin } from 'libs/typeorm';
import { BcryptService } from 'libs/injectables';

@Injectable()
export class AdminAuthService {
  constructor(
    private adminService: AdminService,
    private jwtService: JwtService,
    private readonly bcryptService: BcryptService,
  ) {}

  async validateUser(email: string, password: string): Promise<Admin | null> {
    const user = await this.adminService.findAdminByEmail(email);

    if (user && (await this.bcryptService.compare(password, user.password))) {
      return user;
    }

    return null;
  }

  async login(
    user: Admin,
  ): Promise<{ admin: Admin; accessToken: string; expiresIn: number }> {
    const payload = { email: user.email, sub: user.id };

    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: 86400 }),
      expiresIn: 86400,
      admin: user,
    };
  }
}
