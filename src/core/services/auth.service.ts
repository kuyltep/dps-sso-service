import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { UserLoginDto } from 'src/common/dtos/user/user.login.dto';
import { ExceptionService } from './exception.service';
import { UserRegisterDto } from 'src/common/dtos/user/user.register.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from './config.service';
import { Response } from 'express';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly exceptionService: ExceptionService,
    private readonly configService: ConfigService,
  ) {}

  public async loginUser(userLoginDto: UserLoginDto) {
    try {
      const user = await this.userService.findByUniqueParam(
        userLoginDto.login,
        false,
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

  public async refreshToken(authorizationHeader: string, res: Response) {
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      throw this.exceptionService.unauthorizedException('No token provided');
    }

    const token = authorizationHeader.split(' ')[1];

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.getJwtSecret(),
      });

      const user = await this.userService.findByUniqueParam(payload.sub);
      if (!user) {
        throw this.exceptionService.unauthorizedException('User not found');
      }
      const isTokenAboutToExpire = this.isTokenAboutToExpire(payload.exp);

      if (isTokenAboutToExpire) {
        const newAccessToken = await this.jwtService.signAsync({
          id: user.id,
          role: user.role,
        });
        res.setHeader('x-new-access-token', newAccessToken);
      }

      res.setHeader('x-new-access-token', token);
    } catch (error) {
      throw this.exceptionService.unauthorizedException(
        'Invalid or expired token',
      );
    }
  }

  private isTokenAboutToExpire(expirationTime: number): boolean {
    const currentTime = Math.floor(Date.now() / 1000);
    const timeRemaining = expirationTime - currentTime;

    return timeRemaining < 3600;
  }
}
