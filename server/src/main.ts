import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config'; // Add this line to load .env variables

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const port = process.env.PORT || "";
  await app.listen(port, "0.0.0.0");
}
bootstrap();
