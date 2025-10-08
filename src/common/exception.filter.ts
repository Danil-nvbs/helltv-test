import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  ValidationError,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    console.error(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    console.log(exception instanceof BadRequestException);
    if (exception instanceof BadRequestException) {
      let errors = '';
      const exceptionResponse = exception.getResponse() as ValidationError;
      if (
        typeof exceptionResponse === 'object' &&
        'message' in exceptionResponse
      ) {
        const errorObj = exceptionResponse;
        if (Array.isArray(errorObj.message)) {
          errors = errorObj.message.join(', ');
        }
      }
      response.status(exception.getStatus()).json({
        success: false,
        message: errors || 'Validation failed',
      });
    } else if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json({
        success: false,
        message: exception.message,
      });
    } else {
      response.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
}
