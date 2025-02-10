import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ExceptionService } from './exception.service';
import { Prisma } from '@prisma/client';
import { UserRegisterDto } from 'src/common/dtos/user/user.register.dto';
import { UserChangePasswordDto } from 'src/common/dtos/user/user.change-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly exceptionService: ExceptionService,
  ) {}

  public async create(user: UserRegisterDto, isOmitPassword?: boolean) {
    try {
      const userArgs = {
        data: user,
      } as Prisma.UserCreateArgs;
      isOmitPassword ? (userArgs.omit.password = true) : null;
      return await this.prismaService.user.create(userArgs);
    } catch (error) {
      throw this.exceptionService.internalServerError(error);
    }
  }

  public async findByUniqueParam(
    param: string,
    type: 'id' | 'login',
    isOmitPassword: boolean = true,
  ) {
    try {
      const userArgs = {
        where: {},
      } as Prisma.UserFindUniqueOrThrowArgs;
      type === 'id'
        ? (userArgs.where.id = param)
        : (userArgs.where.login = param);
      isOmitPassword ? (userArgs.omit.password = true) : null;
      return await this.prismaService.user.findUnique(userArgs);
    } catch (error) {
      throw this.exceptionService.internalServerError(error);
    }
  }

  public async changePassword(
    userChangePasswordDto: UserChangePasswordDto,
    id: string,
  ) {
    try {
      const user = await this.findByUniqueParam(id, 'id', false);
      const salt = await bcrypt.genSalt();
      const isComparePassword = await bcrypt.compare(
        userChangePasswordDto.oldPassword,
        user.password,
      );
      if (!isComparePassword) {
        throw new this.exceptionService.unauthorizedException(
          'Invalid password was provided',
        );
      }
      const encryptedNewPassword = await bcrypt.hash(
        userChangePasswordDto.newPassword,
        salt,
      );
      await this.prismaService.user.update({
        where: {
          id: id,
        },
        data: {
          password: encryptedNewPassword,
        },
      });
      return { message: 'success' };
    } catch (error) {
      throw this.exceptionService.internalServerError(error);
    }
  }
}
