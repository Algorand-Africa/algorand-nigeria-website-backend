import { User } from '../../../dal/entities/user.entity';
import { ProfileResponseDto } from '../dto/profile.dto';

export class ProfileDtoMapper {
  static toDto(user: User): ProfileResponseDto {
    return {
      id: user.id,
      fullName: user.full_name,
      username: user.username,
      phone: user.phone,
      verified: user.email_verified_at ? true : false,
      role: user.role,
    };
  }
}
