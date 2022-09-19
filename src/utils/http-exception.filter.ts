import { BaseExceptionFilter } from '@nestjs/core';
import { ArgumentsHost, Catch } from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
export class HttpException extends BaseExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        console.log('Exception thrown', exception);
        const context = host.switchToHttp();
        const response = context.getResponse<Response>();
        const request = context.getRequest<Request>();
        const status = exception.getStatus();
        const message = exception.getMessage();

        response
            .status(status)
            .json({
                message,
                statusCode: status,
                time: new Date().toISOString(),
            });
    }
}