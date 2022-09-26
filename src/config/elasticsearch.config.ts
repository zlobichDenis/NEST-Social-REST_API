import { ConfigService } from '@nestjs/config';

export const getElasticSearchConfig = async (configService: ConfigService) => {
    return {
        node: configService.get('ELASTICSEARCH_NODE'),
        auth: {
            username: configService.get('ELASTICSEARCH_USERNAME'),
            password: configService.get('admin'),
        },
    };
};