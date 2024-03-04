import "./mongodb"
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from "cookie-parser"
import "dotenv/config"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser())
  app.enableCors()
  app.setGlobalPrefix('api')
  const PORT = process.env.PORT || 3000
  await app.listen(PORT);
}
bootstrap();
