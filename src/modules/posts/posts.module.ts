import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostEntity } from './entities';
import { PostSearchService } from './post-search/post-search.service';
import { SearchModule } from '../search/search.module';

@Module({
  imports: [
      TypeOrmModule.forFeature([PostEntity]),
      SearchModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, PostSearchService],
})
export class PostsModule {}
