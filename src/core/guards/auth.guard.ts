import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ExceptionService } from '../services/exception.service';
import { ConfigService } from '../services/config.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly exceptionService: ExceptionService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeaders(request);
    if (!token) {
      throw this.exceptionService.unauthorizedException(
        'No token was provided',
      );
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.getJwtSecret(),
      });
      request['user'] = payload;
    } catch {
      throw this.exceptionService.unauthorizedException('Invalid token');
    }
    return true;
  }

  private extractTokenFromHeaders(request: Request): string | undefined {
    try {
      const [type, token] = request.headers.authorization.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    } catch (error) {
      throw this.exceptionService.unauthorizedException('No token provided');
    }
  }
}
