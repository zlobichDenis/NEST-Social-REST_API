import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt/dist/interfaces/jwt-module-options.interface';

export const getJwtConfig = async (configService: ConfigService): Promise<JwtModuleOptions> => {
    return {
        secret: configService.get('JWT_SECRET'),
        signOptions: {
            expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`,
        }
    };
};