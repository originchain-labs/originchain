const REQUIRED_ENV_VARS = [
  "DATABASE_URL",
  "JWT_SECRET",
  "PINATA_JWT",
  "PINATA_GATEWAY_URL",
  "FRONTEND_URL",
  "RPC_URL",
] as const;

export function validateEnv() {
  const missing = REQUIRED_ENV_VARS.filter(
    (key) => !process.env[key] || process.env[key]!.trim() === ""
  );

  if (missing.length > 0) {
    console.error(`[FATAL] Missing required environment variable(s): ${missing.join(", ")}`);
    process.exit(1);
  }
}
