import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { UserEntity } from './entities';

@Module({
  imports: [
      TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
