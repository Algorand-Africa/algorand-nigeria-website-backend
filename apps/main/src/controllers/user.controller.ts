import {
  Controller,
  Get,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from 'modules/user/user.service';
import { JwtAuthGuard } from 'libs/guards/jwt/jwt-auth.guard';

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
  })
  @UseGuards(JwtAuthGuard)
  @Get('overview')
  @UsePipes(ValidationPipe)
  async getOverview() {
    return 'Hello world';
  }
}
