import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ExceptionService } from './exception.service';
import {
  StudentRegisterDto,
  StudentRegisterResponseDto,
} from 'src/common/dtos/student/student.register';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
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
      const countOfStudents = await this.prismaService.student.count({
        where: {
          university_id: studentRegisterDto.university_id,
        },
      });
      const randomPassword = Array(10)
        .fill(0)
        .map((val, index) => Math.random() * (index + 1))
        .join('');
      const salt = await bcrypt.genSalt();
      const studentPassword = studentRegisterDto.password || randomPassword;
      const hashPassword = await bcrypt.hash(studentPassword, salt);
      const studentLogin =
        studentRegisterDto.login ||
        `${studentRegisterDto.university_id}_${countOfStudents}`;
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

  public async getStudentsByUniversityId(id: string) {
    try {
      return await this.prismaService.student.findMany({
        where: {
          university_id: id,
        },
      });
    } catch (error) {
      throw this.exceptionService.internalServerError(error);
    }
  }
}
