import {
  Body,
  Controller,
  Delete,
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

  @ApiParam({
    name: 'unique',
    required: true,
    type: String,
    description: 'User unique param (login or id',
  })
  @Get('/:unique')
  public async getByUniqueParam(@Param('unique') unique: string) {
    return await this.userService.findByUniqueParam(unique);
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

  @Delete('profile')
  public async deleteUserProfile(@Request() req) {
    return await this.userService.deleteProfileById(req.user.sub);
  }

  @ApiParam({
    name: 'id',
    description: 'User id',
    type: String,
  })
  @Delete('/:id')
  public async deleteUserById(@Param('id') id: string) {
    return await this.userService.deleteProfileById(id);
  }
}
