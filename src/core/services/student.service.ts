import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ExceptionService } from './exception.service';
import {
  StudentRegisterDto,
  StudentRegisterResponseDto,
} from 'src/common/dtos/student/student.register';
import { Prisma } from '@prisma/client';
import {
  StudentUpdateByAdminDto,
  StudentUpdateDto,
} from 'src/common/dtos/student/student.update.dto';
import { generateLoginAndPassword } from '../utils/generateLoginAndPassword';
import { filterFields } from '../utils/filterFields';

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
      const [newStudentLogin, hashPassword, studentPassword] =
        await generateLoginAndPassword(
          lastCratedStudent?.user.login,
          studentRegisterDto.password,
        );
      const studentLogin =
        studentRegisterDto.login ||
        `${studentRegisterDto.university_id}_${newStudentLogin}`;

      const studentCreateData = filterFields(studentRegisterDto, [
        'name',
        'university_id',
      ]);
      const studentCreateArgs = {
        data: {
          ...studentCreateData,
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

  public async updateStudentInfoByTypeId(
    updateStudentInfoByAdminDto: StudentUpdateDto | StudentUpdateByAdminDto,
    type: 'user' | 'student',
    id: string,
  ) {
    try {
      const updateArgs = {
        where: type === 'user' ? { user_id: id } : { id },
        data: {
          ...updateStudentInfoByAdminDto,
        },
      } as Prisma.StudentUpdateArgs;
      return await this.prismaService.student.update(updateArgs);
    } catch (error) {
      throw this.exceptionService.internalServerError(error);
    }
  }
}
