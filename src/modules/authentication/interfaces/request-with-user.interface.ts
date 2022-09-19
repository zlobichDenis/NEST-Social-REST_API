import { Request } from 'express';

import { UserEntity } from '../../users/entities';

export interface RequestWithUser extends Request {
    user: UserEntity;
}