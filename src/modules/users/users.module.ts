import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { FilesModule } from '../files/files.module';
import { UsersService } from './users.service';
import { UserEntity } from './entities';
import { UsersController } from './users.controller';

@Module({
  imports: [
      FilesModule,
      ConfigModule,
      TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
