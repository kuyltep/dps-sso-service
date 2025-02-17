import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ExceptionService } from './exception.service';
import { Prisma } from '@prisma/client';
import { EmployeeRegisterDto } from 'src/common/dtos/employee/employee.register.dto';
import {
  EmployeeUpdateByAdminDto,
  EmployeeUpdateDto,
} from 'src/common/dtos/employee/employee.update.dto';
import { filterFields } from '../utils/filterFields';
import { generateLoginAndPassword } from '../utils/generateLoginAndPassword';
import { EmployeeQueryDto } from 'src/common/dtos/query/employee.query';

@Injectable()
export class EmployeeService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly exceptionService: ExceptionService,
  ) {}

  public async getEmployeersByCompanyId({
    page_number,
    page_size,
    company_id,
    position,
  }: EmployeeQueryDto) {
    try {
      const employersArgs = {
        where: {
          company_id,
        },
        skip: page_number * page_size,
        take: page_size,
      } as Prisma.EmployeeFindManyArgs;

      position
        ? (employersArgs.where.position = {
            contains: position,
            mode: 'insensitive',
          })
        : null;
      return await this.prismaService.employee.findMany(employersArgs);
    } catch (error) {
      throw this.exceptionService.internalServerError(error);
    }
  }

  public async getEmployeeProfile(userId: string) {
    try {
      return await this.prismaService.employee.findUnique({
        where: {
          user_id: userId,
        },
      });
    } catch (error) {
      throw this.exceptionService.internalServerError(error);
    }
  }

  public async getEmployeeById(id: string) {
    try {
      return await this.prismaService.employee.findUnique({
        where: {
          id,
        },
      });
    } catch (error) {
      throw this.exceptionService.internalServerError(error);
    }
  }

  public async registerEmployee(employeeRegisterDto: EmployeeRegisterDto) {
    try {
      const lastCratedEmployee = await this.prismaService.employee.findFirst({
        where: { company_id: employeeRegisterDto.company_id },
        orderBy: { created_at: 'desc' },
        take: 1,
        select: {
          user: {
            select: { login: true },
          },
        },
      });
      const [newEmployeeLogin, hashPassword, employeePassword] =
        await generateLoginAndPassword(
          lastCratedEmployee?.user.login,
          employeeRegisterDto.password,
        );
      const employeeLogin =
        employeeRegisterDto.login ||
        `${employeeRegisterDto.company_id}_${newEmployeeLogin}`;

      const employeeCreateData = filterFields(employeeRegisterDto, [
        'company_id',
        'email',
        'name',
        'phone_number',
        'position',
        'role',
      ]);

      const employeeArgs = {
        data: {
          ...employeeCreateData,
          user: employeeRegisterDto.login
            ? {
                connect: {
                  login: employeeRegisterDto.login,
                },
              }
            : {
                create: {
                  login: employeeRegisterDto.login || employeeLogin,
                  role: 'EMPLOYEE',
                  password: hashPassword,
                },
              },
        },
      } as Prisma.EmployeeCreateArgs;
      await this.prismaService.employee.create(employeeArgs);
      return {
        login: employeeRegisterDto.login || employeeLogin,
        password: employeeRegisterDto.password || employeePassword,
        name: employeeRegisterDto.name,
      };
    } catch (error) {
      throw this.exceptionService.internalServerError(error);
    }
  }

  public async updateEmployeeByTypeId(
    id: string,
    type: 'user' | 'employee',
    updateEmployeeDto: EmployeeUpdateDto | EmployeeUpdateByAdminDto,
  ) {
    try {
      const employeeArgs = {
        where: type === 'user' ? { user_id: id } : { id },
        data: { ...updateEmployeeDto },
      } as Prisma.EmployeeUpdateArgs;
      return await this.prismaService.employee.update(employeeArgs);
    } catch (error) {
      throw this.exceptionService.internalServerError(error);
    }
  }
}
