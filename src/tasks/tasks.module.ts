import { AuthModule } from './../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
import { Task } from './task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), AuthModule],
  providers: [TasksService, TasksRepository],
  controllers: [TasksController],
})
export class TasksModule {}
