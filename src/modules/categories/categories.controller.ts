import { Body, Controller, Get, Param, Put } from '@nestjs/common';

import { CategoriesService } from './categories.service';
import { FindOneParams } from '../../utils';
import { UpdateCategoryDto } from './dto';

@Controller('categories')
export class CategoriesController {
    constructor(
        private readonly categoriesService: CategoriesService,
    ) {
    }

    @Get()
    async getAllCategories() {
        return this.categoriesService.getAllCategories();
    }

    @Get(':id')
    async getCategoryById(@Param() { id }: FindOneParams) {
        return this.categoriesService.getCategoryById(Number(id));
    }

    @Put(':id')
    async updateCategoryById(@Param() { id }: FindOneParams, @Body() dto: UpdateCategoryDto) {
        return this.categoriesService.updateCategory(Number(id), dto);
    }
}
