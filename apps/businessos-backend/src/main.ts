import "dotenv/config";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import { AppModule } from "./app.module";
import { appConfig } from "./config/app.config";
import { PrismaExceptionFilter } from "./core/filters/prisma-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({ origin: appConfig.corsOrigin });
  app.setGlobalPrefix("api");
  app.useStaticAssets(join(process.cwd(), "uploads"), {
    prefix: "/api/uploads/",
  });
  app.useGlobalFilters(new PrismaExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  await app.listen(appConfig.port, "0.0.0.0");
}

bootstrap();
