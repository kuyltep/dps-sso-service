import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { UserLoginDto } from 'src/common/dtos/user/user.login.dto';
import { ExceptionService } from './exception.service';
import { UserRegisterDto } from 'src/common/dtos/user/user.register.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly exceptionService: ExceptionService,
  ) {}

  public async loginUser(userLoginDto: UserLoginDto) {
    try {
      const user = await this.userService.findByUniqueParam(
        userLoginDto.login,
        'login',
      );
      if (!user) {
        throw this.exceptionService.unauthorizedException('No user found');
      }

      const isComparePassword = await bcrypt.compare(
        userLoginDto.password,
        user.password,
      );
      if (!isComparePassword) {
        throw this.exceptionService.unauthorizedException(
          'Invalid password was provided',
        );
      }
      return {
        access_token: await this.jwtService.signAsync({
          sub: user.id,
          role: user.role,
        }),
      };
    } catch (error) {
      throw this.exceptionService.internalServerError(error);
    }
  }

  public async registerUser(userRegisterDto: UserRegisterDto) {
    try {
      const salt = await bcrypt.genSalt();
      const encryptedPassword = await bcrypt.hash(
        userRegisterDto.password,
        salt,
      );
      await this.userService.create({
        ...userRegisterDto,
        password: encryptedPassword,
      });
      return { message: 'success' };
    } catch (error) {
      throw this.exceptionService.internalServerError(error);
    }
  }
}
