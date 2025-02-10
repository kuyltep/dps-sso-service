import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserLoginDto } from 'src/common/dtos/user/user.login.dto';
import { UserRegisterDto } from 'src/common/dtos/user/user.register.dto';
import { Public } from '../guards/public.guard';

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
  public async refreshToken() {}
}
