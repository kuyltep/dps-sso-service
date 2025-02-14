import { Global, Module } from '@nestjs/common';
import { EmployeeService } from '../services/employee.service';
import { EmployeeController } from '../controllers/employee.controller';

@Global()
@Module({
  controllers: [EmployeeController],
  providers: [EmployeeService],
  exports: [EmployeeService],
})
export class EmployeeModule {}
