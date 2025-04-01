import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ExceptionService } from './exception.service';
import { Prisma } from '@prisma/client';
import { UserRegisterDto } from 'src/common/dtos/user/user.register.dto';
import {
  UserChangeLoginDto,
  UserChangePasswordDto,
} from 'src/common/dtos/user/user.change.dto';
import * as bcrypt from 'bcrypt';
import {
  QueryDeleteUsers,
  QueryDeleteUsersByIds,
} from 'src/common/dtos/query/user.query.dto';
import { ResumesService } from './resume.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly exceptionService: ExceptionService,
    private readonly resumesService: ResumesService,
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
    isOmitPassword: boolean = true,
  ) {
    try {
      const userArgs = {
        where: {
          OR: [{ id: param }, { login: param }],
        },
        omit: {
          password: isOmitPassword,
        },
      } as Prisma.UserFindFirstArgs;
      return await this.prismaService.user.findFirst(userArgs);
    } catch (error) {
      throw this.exceptionService.internalServerError(error);
    }
  }

  public async changePassword(
    userChangePasswordDto: UserChangePasswordDto,
    id: string,
  ) {
    try {
      const user = await this.findByUniqueParam(id, false);
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

  public async changeLogin(userChangeLoginDto: UserChangeLoginDto, id: string) {
    try {
      const user = await this.prismaService.user.findUnique({ where: { id } });
      if (!user) {
        throw this.exceptionService.unauthorizedException('Invalid jwt token');
      }
      const isComparePassword = await bcrypt.compare(
        userChangeLoginDto.password,
        user.password,
      );
      if (!isComparePassword) {
        throw this.exceptionService.unauthorizedException('Invalid password');
      }
      await this.prismaService.user.update({
        where: {
          id,
        },
        data: {
          login: userChangeLoginDto.login,
        },
      });
      return { message: 'ok' };
    } catch (error) {
      throw this.exceptionService.internalServerError(error);
    }
  }

  public async deleteUsersByIds({ ids, type }: QueryDeleteUsersByIds) {
    if (type === 'employee') {
      return await this.prismaService.user.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      });
    } else {
      const users = await this.prismaService.user.findMany({
        where: {
          id: {
            in: ids,
          },
        },
        select: {
          student: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!users.length) {
        throw new BadRequestException('INVALID IDS WAS PROVIDED');
      }

      const studentIds = [];

      for (const user of users) {
        if (user.student && user.student?.id) {
          studentIds.push(user.student.id);
        }
      }

      await this.resumesService.deleteResumesByStudentsIds(studentIds);

      return await this.prismaService.user.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      });
    }
  }

  public async deleteProfileById(id: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          student: {
            select: {
              id: true,
            },
          },
        },
      });

      if (user.student && user.student?.id) {
        await this.resumesService.deleteResumesByStudentId(user.student.id);
      }

      await this.prismaService.user.delete({
        where: {
          id,
        },
      });

      return { message: 'ok' };
    } catch (error) {
      throw this.exceptionService.internalServerError(error);
    }
  }

  public async deleteUsersByTypeId(query: QueryDeleteUsers) {
    try {
      const deleteManyArgs = {
        where: {},
      } as Prisma.UserDeleteManyArgs;
      if (query.type === 'student') {
        deleteManyArgs.where.student = {
          university_id: query.id,
        };

        const students = await this.prismaService.student.findMany({
          where: {
            university_id: query.id,
          },
          select: {
            id: true,
          },
        });
        const studentIds = students.map((student) => student.id);

        await this.resumesService.deleteResumesByStudentsIds(studentIds);
      } else {
        deleteManyArgs.where.employee = {
          company_id: query.id,
        };
      }
      return await this.prismaService.user.deleteMany(deleteManyArgs);
    } catch (error) {
      throw this.exceptionService.internalServerError(error);
    }
  }
}
