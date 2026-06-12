import "reflect-metadata";
import "dotenv/config";
import express from "express";
import { configureApp } from "./bootstrap-app";

const server = express();
let ready: Promise<void> | undefined;

async function ensureReady() {
  if (!ready) {
    ready = configureApp(server).then(() => undefined);
  }
  await ready;
}

export default async function handler(
  req: express.Request,
  res: express.Response,
) {
  await ensureReady();
  server(req, res);
}
