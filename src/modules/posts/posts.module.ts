import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostEntity } from './entities';

@Module({
  imports: [
      TypeOrmModule.forFeature([PostEntity]),
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
