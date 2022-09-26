import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

import { getElasticSearchConfig } from '../../config';

@Module({
    imports: [
        ConfigModule,
        ElasticsearchModule.registerAsync({
            imports: [ConfigModule],
            useFactory: getElasticSearchConfig,
            inject: [ConfigService],
        }),
    ],
    exports: [ElasticsearchModule],
})
export class SearchModule {}
