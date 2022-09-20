import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { FilesService } from './files.service';
import { PublicFileEntity } from './entities';

@Module({
  imports: [
      TypeOrmModule.forFeature([PublicFileEntity]),
      ConfigModule,
  ],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
