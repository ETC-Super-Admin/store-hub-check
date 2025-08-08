import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    const port = process.env.PORT || 'unknown';
    return `server is running on port=${port}`;
  }
}
