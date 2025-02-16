import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserLoginDto } from 'src/common/dtos/user/user.login.dto';
import { UserRegisterDto } from 'src/common/dtos/user/user.register.dto';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  public async loginUser(@Body() userLoginDto: UserLoginDto) {
    return await this.authService.loginUser(userLoginDto);
  }

  @Post('register')
  public async registerUser(@Body() userRegisterDto: UserRegisterDto) {
    return await this.authService.registerUser(userRegisterDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  public async refreshToken(@Req() req: Request) {
    return await this.authService.refreshToken(req.headers.authorization);
  }
}
