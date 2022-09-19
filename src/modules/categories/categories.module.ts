import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryEntity } from './entities';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([CategoryEntity]),
    ],
    controllers: [CategoriesController],
    providers: [CategoriesService],
})
export class CategoriesModule {}
