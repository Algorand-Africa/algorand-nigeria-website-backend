import {
  Controller,
  Request,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Body,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { CreateUserDto, LogInDto, LogInResponseDto, UserDto } from 'libs/dto';
import { LocalAuthGuard } from 'libs/guards/local/local-auth.guard';
import { AuthService } from 'modules/auth/auth.service';

@ApiTags('Authentication Manager')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: "This handles a user's login request." })
  @ApiResponse({
    status: 200,
    description: 'Object containing jwt token.',
    type: LogInResponseDto,
  })
  @ApiBody({ type: LogInDto })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @ApiOperation({ summary: "This handles a user's sign up request." })
  @ApiResponse({
    status: 200,
    description: 'Account created successfully.',
    type: UserDto,
  })
  @ApiBody({ type: CreateUserDto })
  @Post('sign-up')
  @UsePipes(ValidationPipe)
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }
}
