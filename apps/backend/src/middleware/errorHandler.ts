import type { Request, Response, NextFunction } from "express";

const ERROR_MAP: Record<string, { status: number; code: string }> = {
  VALIDATION_ERROR: { status: 400, code: "VALIDATION_ERROR" },
  TX_NOT_FOUND_ON_CHAIN: { status: 400, code: "TX_NOT_FOUND_ON_CHAIN" },
  TX_MISMATCH: { status: 400, code: "TX_MISMATCH" },
  INVALID_FILE_TYPE: { status: 400, code: "VALIDATION_ERROR" },

  UNAUTHORIZED: { status: 401, code: "UNAUTHORIZED" },
  INVALID_TOKEN: { status: 401, code: "INVALID_TOKEN" },

  FORBIDDEN: { status: 403, code: "FORBIDDEN" },

  CREATOR_NOT_FOUND: { status: 404, code: "CREATOR_NOT_FOUND" },
  ASSET_NOT_FOUND: { status: 404, code: "ASSET_NOT_FOUND" },
  ORGANIZATION_NOT_FOUND: { status: 404, code: "ORGANIZATION_NOT_FOUND" },
  CERTIFICATE_NOT_FOUND: { status: 404, code: "CERTIFICATE_NOT_FOUND" },

  ALREADY_REVIEWED: { status: 409, code: "ALREADY_REVIEWED" },
  ASSET_ALREADY_REGISTERED: { status: 409, code: "ASSET_ALREADY_REGISTERED" },
  PROFILE_ALREADY_EXISTS: { status: 409, code: "PROFILE_ALREADY_EXISTS" },
  ALREADY_OWNS_ORGANIZATION: { status: 409, code: "ALREADY_OWNS_ORGANIZATION" },

  RATE_LIMIT_EXCEEDED: { status: 429, code: "RATE_LIMIT_EXCEEDED" },
  IPFS_PIN_FAILED: { status: 502, code: "IPFS_PIN_FAILED" },
};

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const message = typeof err === "string" ? err : err?.message || "UNKNOWN_ERROR";
  const mapped = ERROR_MAP[message];

  if (mapped) {
    return res.status(mapped.status).json({
      error: { code: mapped.code, message },
    });
  }

  // Fallback for unhandled or unexpected server-side errors
  console.error("[ERROR_HANDLER]", err);
  return res.status(500).json({
    error: { code: "UNKNOWN_ERROR", message: "Internal server error" },
  });
}
