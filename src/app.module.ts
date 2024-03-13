import { Module } from '@nestjs/common';
import { UserModule } from './module/user/user.module';
import { configDB } from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRootAsync(configDB), UserModule],
})
export class AppModule {}
