import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModels } from './models/user.model';

@Module({
  imports: [TypeOrmModule.forFeature([UserModels])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
