import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    Inject,
    Post,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { CreateSubscriptionDto } from './dto';
import { SUBSCRIPTION_NAME, SubscriptionServiceMessages } from './constants';
import { JwtAuthenticationGuard } from '../authentication/guards';

@Controller('subscription')
@UseInterceptors(ClassSerializerInterceptor)
export class SubscriptionController {
    constructor(
        @Inject(SUBSCRIPTION_NAME)
        private readonly subscriptionService: ClientProxy,
    ) {}

    @Get()
    @UseGuards(JwtAuthenticationGuard)
    async getSubscribers() {
        return this.subscriptionService.send({
            cmd: SubscriptionServiceMessages.getAllSubscribers,
        }, '');
    }

    @Post()
    @UseGuards(JwtAuthenticationGuard)
    async subscribe(@Body() dto: CreateSubscriptionDto) {
        return this.subscriptionService.emit({
            cmd: SubscriptionServiceMessages.subscribe,
        }, dto);
    }

}
