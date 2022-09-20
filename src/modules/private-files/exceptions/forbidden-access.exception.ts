import { ForbiddenException } from '@nestjs/common';

import { errorMessages } from '../constants';

export class ForbiddenAccessException extends ForbiddenException {
    constructor(fileId: number) {
        super(errorMessages.forbiddenAccess(fileId));
    }
}