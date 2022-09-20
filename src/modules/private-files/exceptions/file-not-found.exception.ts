import { NotFoundException } from '@nestjs/common';

import { errorMessages } from '../constants';

export class FileNotFoundException extends NotFoundException {
    constructor(fileId: number) {
        super(errorMessages.fileNotFound(fileId));
    }
}