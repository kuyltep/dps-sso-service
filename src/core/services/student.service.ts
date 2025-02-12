import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ExceptionService } from './exception.service';
import {
  StudentRegisterDto,
  StudentRegisterResponseDto,
} from 'src/common/dtos/student/student.register';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import {
  StudentUpdateByAdminDto,
  StudentUpdateDto,
} from 'src/common/dtos/student/student.update.dto';
@Injectable()
export class StudentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly exceptionService: ExceptionService,
  ) {}

  public async registerStudent(
    studentRegisterDto: StudentRegisterDto,
  ): Promise<StudentRegisterResponseDto> {
    try {
      const lastCratedStudent = await this.prismaService.student.findFirst({
        where: { university_id: studentRegisterDto.university_id },
        orderBy: { created_at: 'desc' },
        take: 1,
        select: {
          user: {
            select: { login: true },
          },
        },
      });
      const newStudentLogin = +lastCratedStudent.user.login.split('_')[1] + 1;
      const randomPassword = Array(10)
        .fill(0)
        .map((val, index) => Math.random() * (index + 1))
        .join('');
      const salt = await bcrypt.genSalt();
      const studentPassword = studentRegisterDto.password || randomPassword;
      const hashPassword = await bcrypt.hash(studentPassword, salt);
      const studentLogin =
        studentRegisterDto.login ||
        `${studentRegisterDto.university_id}_${newStudentLogin}`;
      const studentCreateArgs = {
        data: {
          name: studentRegisterDto.name,
          university_id: studentRegisterDto.university_id,
          user: {
            connectOrCreate: {
              where: {
                login: studentLogin,
              },
              create: {
                login: studentLogin,
                role: 'STUDENT',
                password: hashPassword,
              },
            },
          },
        },
      } as Prisma.StudentCreateArgs;
      await this.prismaService.student.create(studentCreateArgs);
      return {
        login: studentLogin,
        password: studentPassword,
        name: studentRegisterDto.name,
      };
    } catch (error) {
      throw this.exceptionService.internalServerError(error);
    }
  }

  public async getStudentsByUniversityId(
    id: string,
    faculty: string,
    study_year: number,
    speciality: string,
    page_number: number = 0,
    page_size: number = 30,
  ) {
    try {
      const studentArgs = {
        where: {
          university_id: id,
        },
      } as Prisma.StudentFindManyArgs;

      faculty
        ? (studentArgs.where.faculty = {
            contains: faculty,
            mode: 'insensitive',
          })
        : null;
      study_year ? (studentArgs.where.study_year = study_year) : null;
      speciality ? (studentArgs.where.speciality = speciality) : null;
      studentArgs.skip = page_number * page_size;
      studentArgs.take = page_size;

      return await this.prismaService.student.findMany({
        where: {
          university_id: id,
        },
      });
    } catch (error) {
      throw this.exceptionService.internalServerError(error);
    }
  }

  public async getStudentById(id: string) {
    try {
      return await this.prismaService.student.findUnique({
        where: { id },
      });
    } catch (error) {
      throw this.exceptionService.internalServerError(error);
    }
  }

  public async getStudentProfile(userId: string) {
    try {
      return await this.prismaService.student.findUnique({
        where: {
          user_id: userId,
        },
      });
    } catch (error) {
      throw this.exceptionService.internalServerError(error);
    }
  }

  public async updateStudentProfile(
    updateStudentProfile: StudentUpdateDto,
    userId: string,
  ) {
    try {
      return await this.prismaService.student.update({
        where: { user_id: userId },
        data: { ...updateStudentProfile },
      });
    } catch (error) {
      throw this.exceptionService.internalServerError(error);
    }
  }

  public async updateStudentInfoById(
    updateStudentInfoByAdminDto: StudentUpdateByAdminDto,
    id: string,
  ) {
    try {
      return await this.prismaService.student.update({
        where: {
          id,
        },
        data: {
          ...updateStudentInfoByAdminDto,
        },
      });
    } catch (error) {
      throw this.exceptionService.internalServerError(error);
    }
  }
}
