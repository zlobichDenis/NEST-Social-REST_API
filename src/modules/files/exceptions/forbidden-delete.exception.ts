import { ForbiddenException } from '@nestjs/common';

import { errorMessages } from '../constants';

export class ForbiddenDeleteException extends ForbiddenException {
    constructor(fileId: number) {
        super(errorMessages.forbiddenDelete(fileId));
    }
}