import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class MainGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (!apiKey) {
      throw new HttpException('API key is missing', HttpStatus.UNAUTHORIZED);
    }

    const validKey = this.configService.get<string>('API_KEY');

    if (apiKey !== validKey) {
      throw new HttpException('Invalid API key', HttpStatus.UNAUTHORIZED);
    }

    return true;
  }
}
