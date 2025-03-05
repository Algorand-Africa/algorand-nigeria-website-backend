import {
  Controller,
  Get,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from 'modules/user/user.service';
import { JwtAuthGuard } from 'libs/guards/jwt/jwt-auth.guard';
import { UserDto } from 'libs/dto';

@ApiTags('User Manager')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiBearerAuth('Bearer')
  @ApiOperation({
    summary: "This returns an overview of a user's information.",
  })
  @ApiResponse({
    status: 200,
    type: UserDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @UsePipes(ValidationPipe)
  async getProfile(@Request() req: any) {
    return this.userService.getUserById(req.user.id);
  }
}
