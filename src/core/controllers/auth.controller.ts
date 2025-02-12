import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserLoginDto } from 'src/common/dtos/user/user.login.dto';
import { UserRegisterDto } from 'src/common/dtos/user/user.register.dto';
import { Public } from '../decorators/public.decorator';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
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
  public async refreshToken(@Req() req: Request, @Res() res: Response) {
    return this.authService.refreshToken(req.headers.authorization, res);
  }
}
