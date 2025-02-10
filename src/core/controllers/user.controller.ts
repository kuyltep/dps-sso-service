import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserChangePasswordDto } from 'src/common/dtos/user/user.change-password.dto';
import { ApiParam } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiParam({ name: 'id', required: false, type: String })
  @ApiParam({ name: 'login', required: false, type: String })
  @Get('')
  public async getByUniqueParam(
    @Param('id') id: string,
    @Param('login') login: string,
  ) {
    const paramType =
      id && id?.length ? 'id' : login && login?.length ? 'login' : null;
    const param = paramType === 'id' ? id : login;
    return await this.userService.findByUniqueParam(param, paramType);
  }

  @HttpCode(HttpStatus.OK)
  @Post('change-password')
  public async changePassword(
    @Body() userChangePasswordDto: UserChangePasswordDto,
    @Request() request,
  ) {
    return await this.userService.changePassword(
      userChangePasswordDto,
      request.user.sub,
    );
  }
}
