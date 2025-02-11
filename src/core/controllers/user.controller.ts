import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Request,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import {
  UserChangeLoginDto,
  UserChangePasswordDto,
} from 'src/common/dtos/user/user.change.dto';
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
  @Patch('change-password')
  public async changePassword(
    @Body() userChangePasswordDto: UserChangePasswordDto,
    @Request() request,
  ) {
    return await this.userService.changePassword(
      userChangePasswordDto,
      request.user.sub,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Patch('change-login')
  public async changeLogin(
    @Body() userChangeLoginDto: UserChangeLoginDto,
    @Request() request,
  ) {
    return this.userService.changeLogin(userChangeLoginDto, request.user.sub);
  }
}
