import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BcryptService {
  async hash(payload: string, rounds = 10): Promise<string> {
    const salt = await this.generateSalt(rounds);
    return bcrypt.hash(payload, salt);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }

  async generateSalt(rounds = 10): Promise<string> {
    return await bcrypt.genSalt(rounds);
  }
}
