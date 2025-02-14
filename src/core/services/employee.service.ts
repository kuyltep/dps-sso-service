import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ExceptionService } from './exception.service';
import { Prisma } from '@prisma/client';
import { EmployeeRegisterDto } from 'src/common/dtos/employee/employee.register.dto';
import * as bcrypt from 'bcrypt';
import {
  EmployeeUpdateByAdminDto,
  EmployeeUpdateDto,
} from 'src/common/dtos/employee/employee.update.dto';

@Injectable()
export class EmployeeService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly exceptionService: ExceptionService,
  ) {}

  public async getEmployeersByCompanyId(
    id: string,
    position: string,
    page_size: number = 30,
    page_number: number = 0,
  ) {
    try {
      const employersArgs = {
        where: {
          company_id: id,
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
      const newEmployeeLogin = +lastCratedEmployee.user.login.split('_')[1] + 1;
      const randomPassword = Array(10)
        .fill(0)
        .map((val, index) => Math.random() * (index + 1))
        .join('');
      const salt = await bcrypt.genSalt();
      const employeePassword = employeeRegisterDto.password || randomPassword;
      const hashPassword = await bcrypt.hash(employeePassword, salt);
      const employeeLogin =
        employeeRegisterDto.login ||
        `${employeeRegisterDto.company_id}_${newEmployeeLogin}`;

      const employeeArgs = {
        data: {
          company_id: employeeRegisterDto.company_id,
          name: employeeRegisterDto.name,
          position: employeeRegisterDto.postition,
          phone_number: employeeRegisterDto.phone_number,
          email: employeeRegisterDto.email,
          user: {
            connectOrCreate: {
              where: {
                login: employeeRegisterDto.login,
              },
              create: {
                login: employeeRegisterDto.login || employeeLogin,
                role: 'EMPLOYEE',
                password: employeeRegisterDto.password || hashPassword,
              },
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
