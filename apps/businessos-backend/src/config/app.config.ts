function parseCorsOrigins(): string | string[] {
  const raw = process.env.CORS_ORIGIN?.trim();
  if (!raw) return "http://localhost:3000";
  if (raw.includes(",")) {
    return raw
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean);
  }
  return raw;
}

export const appConfig = {
  port: Number(process.env.PORT ?? 3001),
  corsOrigin: parseCorsOrigins(),
  jwtSecret: process.env.JWT_SECRET ?? "dev-jwt-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
};
