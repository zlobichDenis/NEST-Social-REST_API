import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { CategoryEntity } from './entities';
import { NotFoundCategoryException } from './exceptions';
import { UpdateCategoryDto } from './dto';

@Injectable()
export class CategoriesService {
    constructor(
        private readonly categoriesRepository: Repository<CategoryEntity>,
    ) {}

    async getAllCategories(): Promise<CategoryEntity[]>{
        return this.categoriesRepository.find({ relations: ['posts'] });
    }

    async getCategoryById(id: number): Promise<CategoryEntity> {
        const category = await this.categoriesRepository.findOne({
            where: {
                id
            },
            relations: ['posts'],
        });

        if (!category) {
            throw new NotFoundCategoryException(id);
        }

        return category;
    }

    async updateCategory(id: number, dto: UpdateCategoryDto): Promise<CategoryEntity> {
        await this.categoriesRepository.update(id, dto);
        const updatedCategory = await this.categoriesRepository.findOne({
            where: {
                id,
            },
            relations: ['posts'],
        });

        if (!updatedCategory) {
            throw new NotFoundCategoryException(id);
        }

        return updatedCategory;
    }
}
