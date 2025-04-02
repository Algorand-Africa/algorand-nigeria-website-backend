import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { minutesFromNow } from 'src/modules/core/utils/date';
import { Repository } from 'typeorm';
import { Token, User } from '../../../dal/entities';
import { TokenType } from '../../../dal/entities/token.entity';
@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,

    private readonly jwtService: JwtService,
  ) {}

  async findByUserId(userId: string): Promise<Token> {
    return this.tokenRepository.findOneBy({ user_id: userId });
  }

  async findByToken(code: string): Promise<Token> {
    return this.tokenRepository.findOneBy({ code });
  }

  private async create(userId: string, type: TokenType): Promise<string> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const entity = this.tokenRepository.create({
      code,
      user_id: userId,
      expires_at: minutesFromNow(15),
      type,
    });

    await this.tokenRepository.save(entity);

    return code;
  }

  generate(userCreated: User, rememberMe?: boolean): any {
    const payload = { email: userCreated.email, sub: userCreated.id };
    const tokenData: Record<string, any> = {};

    if (rememberMe) {
      const expiresIn = '30d';
      tokenData.token = this.jwtService.sign(payload, { expiresIn });
      tokenData.expiresIn = expiresIn;
    } else {
      tokenData.token = this.jwtService.sign(payload);
      tokenData.expiresIn = process.env.JWT_EXPIRY;
    }

    return tokenData;
  }

  verify(tokenStr: string): any {
    return this.jwtService.verify(tokenStr);
  }

  async deleteByToken(code: string): Promise<void> {
    await this.tokenRepository.delete({ code });
  }

  async delete(id: string): Promise<void> {
    await this.tokenRepository.delete(id);
  }
}
