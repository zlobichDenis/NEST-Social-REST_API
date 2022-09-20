import { NotFoundException } from '@nestjs/common';
import { errorMessages } from '../constants';

export class UserNotFoundException extends NotFoundException {
    constructor() {
        super(errorMessages.userNotFoundById);
    }
}