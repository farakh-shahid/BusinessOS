const PRODUCTION_CORS_ORIGINS = [
  "https://getbusinessos.vercel.app",
  "https://businessos-frontend.vercel.app",
] as const;

function normalizeOrigin(origin: string): string {
  return origin.trim().replace(/\/+$/, "");
}

function parseCorsOrigins(): string | string[] {
  const fromEnv = process.env.CORS_ORIGIN?.trim();
  const origins = new Set<string>([
    ...PRODUCTION_CORS_ORIGINS,
    "http://localhost:3000",
  ]);

  if (fromEnv) {
    for (const part of fromEnv.split(",")) {
      const normalized = normalizeOrigin(part);
      if (normalized) origins.add(normalized);
    }
  }

  return [...origins];
}

export const appConfig = {
  port: Number(process.env.PORT ?? 3001),
  corsOrigin: parseCorsOrigins(),
  jwtSecret: process.env.JWT_SECRET ?? "dev-jwt-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
};
