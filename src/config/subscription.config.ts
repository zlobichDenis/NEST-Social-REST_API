import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

export const getSubscriptionsConfig = (configService: ConfigService) => {
    return ClientProxyFactory.create({
        transport: Transport.TCP,
        options: {
            host: configService.get('SUBSCRIBERS_SERVICE_HOST'),
            port: configService.get('SUBSCRIBERS_SERVICE_PORT'),
        },
    });
};