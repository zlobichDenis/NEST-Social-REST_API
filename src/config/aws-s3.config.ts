import { ConfigService } from '@nestjs/config';

export const getAwsS3Config = (configService: ConfigService) => {
    return {
        accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
        region: configService.get('AWS_REGION'),
    };
};