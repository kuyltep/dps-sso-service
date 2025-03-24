import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import {
  UserChangeLoginDto,
  UserChangePasswordDto,
} from 'src/common/dtos/user/user.change.dto';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { User } from '../decorators/user.decorator';
import {
  QueryDeleteUsers,
  QueryDeleteUsersByIds,
} from 'src/common/dtos/query/user.query.dto';

@Controller('users')
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
    return await this.userService.changeLogin(
      userChangeLoginDto,
      request.user.sub,
    );
  }

  @ApiOperation({
    summary: 'Удалить несколько пользователей по их ids',
  })
  @Delete('by-ids')
  public async deleteUsersByIds(@Query() query: QueryDeleteUsersByIds) {
    return await this.userService.deleteUsersByIds(query);
  }

  @ApiOperation({
    summary:
      'Удалить пользователей относящихся к компании или университету по id',
  })
  @Delete()
  public async deleteUsersByTypeId(@Query() query: QueryDeleteUsers) {
    return await this.userService.deleteUsersByTypeId(query);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('profile')
  public async deleteUserProfile(@User('id') id: string) {
    return await this.userService.deleteProfileById(id);
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
