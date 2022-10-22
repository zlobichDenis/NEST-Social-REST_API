import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { getSubscriptionsConfig } from '../../config';
import { SubscriptionController } from './subscription.controller';
import { SUBSCRIPTION_NAME } from './constants';

@Module({
    imports: [ConfigModule],
    controllers: [SubscriptionController],
    providers: [
        {
            provide: SUBSCRIPTION_NAME,
            useFactory: getSubscriptionsConfig,
            inject: [ConfigService],
        },
    ],
})
export class SubscriptionModule {}
