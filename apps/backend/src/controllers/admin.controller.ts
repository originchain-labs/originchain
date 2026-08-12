import type { Response } from "express";
import type { AuthedRequest } from "../middleware/auth.js";
import { getAdminAnalytics } from "../services/organization.service.js";

export async function adminAnalytics(_req: AuthedRequest, res: Response) {
  try {
    const analytics = await getAdminAnalytics();
    res.json(analytics);
  } catch (err) {
    res.status(500).json({ error: { code: "UNKNOWN_ERROR", message: "Failed to fetch admin analytics" } });
  }
}
