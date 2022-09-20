import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { PrivateFilesService } from './private-files.service';
import { PrivateFileEntity } from './entities';

@Module({
  imports: [
      ConfigModule,
      TypeOrmModule.forFeature([PrivateFileEntity]),
  ],
  providers: [PrivateFilesService],
  exports: [PrivateFilesService],
})
export class PrivateFilesModule {}
