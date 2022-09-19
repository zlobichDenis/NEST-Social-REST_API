import { NotFoundException } from '@nestjs/common';

import { errorMessages } from '../constants';

export class PostNotFound extends NotFoundException {
    constructor(postId: number) {
        super(errorMessages.postNotFoundById(postId));
    }
}