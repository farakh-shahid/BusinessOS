import "reflect-metadata";
import "dotenv/config";
import { join } from "path";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import { appConfig } from "./config/app.config";
import { PrismaExceptionFilter } from "./core/filters/prisma-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: appConfig.corsOrigin,
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });
  app.setGlobalPrefix("api");

  if (!process.env.VERCEL) {
    app.useStaticAssets(join(process.cwd(), "uploads"), {
      prefix: "/api/uploads/",
    });
  }

  app.useGlobalFilters(new PrismaExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const port = Number(process.env.PORT ?? appConfig.port);
  await app.listen(port, "0.0.0.0");
}

bootstrap();
