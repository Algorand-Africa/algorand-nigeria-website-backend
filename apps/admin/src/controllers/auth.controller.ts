import {
  Controller,
  Request,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { LogInResponseDto, LogInDto } from 'libs/dto';
import { AdminAuthService as AuthService } from 'modules/admin-auth/admin-auth.service';
import { AdminLocalAuthGuard } from 'libs/guards/local/admin-local-auth.guard';

@ApiTags('Admin Authentication Manager')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: "This handles an admin's login request." })
  @ApiResponse({
    status: 200,
    description: 'Object containing jwt token.',
    type: LogInResponseDto,
  })
  @ApiBody({ type: LogInDto })
  @UseGuards(AdminLocalAuthGuard)
  @Post('login')
  @UsePipes(ValidationPipe)
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }
}
