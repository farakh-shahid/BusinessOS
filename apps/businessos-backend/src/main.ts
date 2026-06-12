import "reflect-metadata";
import "dotenv/config";
import express from "express";
import { configureApp } from "./bootstrap-app";
import { appConfig } from "./config/app.config";

async function bootstrap() {
  const server = express();
  await configureApp(server);
  await server.listen(appConfig.port, "0.0.0.0");
}

bootstrap();
