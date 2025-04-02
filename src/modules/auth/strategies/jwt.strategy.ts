import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/dal/entities';
import { RoleType } from 'src/modules/users/enums/role-type.enum';
import { Repository } from 'typeorm';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'super-secret',
    });
  }

  async validate(payload: {
    sub: string;
    email: string;
    role: RoleType;
  }): Promise<User> {
    const user = await this.usersRepo.findOneBy({ id: payload.sub });

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!user.email_verified_at) {
      throw new UnauthorizedException('Email not verified');
    }

    return {
      ...user,
      password: undefined,
    };
  }
}
