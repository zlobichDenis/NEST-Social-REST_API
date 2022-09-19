import { NotFoundException } from '@nestjs/common';
import { errorMessages } from '../constants';

export class NotFoundCategoryException extends NotFoundException {
    constructor(categoryId: number) {
        super(errorMessages.notFoundCategory(categoryId));
    }
}