import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BcryptService } from 'libs/injectables';
import { UserService } from '../user/user.service';
import { User } from 'libs/typeorm';
import { CreateUserDto, UserDto } from 'libs/dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly bcryptService: BcryptService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email address.');
    }

    if (await this.bcryptService.compare(password, user.password)) return user;

    throw new UnauthorizedException('Incorrect password.');
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };

    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: 86400 }),
      expiresIn: 86400,
    };
  }

  async signup(createUserDto: CreateUserDto): Promise<UserDto> {
    const user = await this.userService.createUser(createUserDto);

    if (!user)
      throw new InternalServerErrorException('User account not created.');

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      profile: {
        id: user.profile.id,
        name: user.profile.name,
        phoneNo: user.profile.phoneNo,
        algoWalletAddress: user.profile.algoWalletAddress,
      },
    };
  }
}
