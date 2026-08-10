import type { Response } from "express";
import type { AuthedRequest } from "../middleware/auth.js";
import { getCreatorByWallet } from "../services/creator.service.js";
import {
  createOrganization,
  getOrganization,
  getMyOrganizations,
  updateOrganization,
} from "../services/organization.service.js";

export async function create(req: AuthedRequest, res: Response) {
  try {
    const creator = await getCreatorByWallet(req.walletAddress!);
    if (!creator) {
      return res.status(404).json({ error: { code: "CREATOR_NOT_FOUND", message: "Creator profile not found" } });
    }
    const name = req.body?.name;
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Organization name is required" } });
    }

    const org = await createOrganization(creator.id, name.trim());
    res.status(201).json(org);
  } catch (err) {
    const message = err instanceof Error ? err.message : "UNKNOWN_ERROR";
    if (message === "ALREADY_OWNS_ORGANIZATION") {
      return res.status(409).json({ error: { code: "ALREADY_OWNS_ORGANIZATION", message: "Creator already owns an organization" } });
    }
    res.status(500).json({ error: { code: "UNKNOWN_ERROR", message: "Failed to create organization" } });
  }
}

export async function getMine(req: AuthedRequest, res: Response) {
  try {
    const creator = await getCreatorByWallet(req.walletAddress!);
    if (!creator) {
      return res.status(404).json({ error: { code: "CREATOR_NOT_FOUND", message: "Creator not found" } });
    }
    const organizations = await getMyOrganizations(creator.id);
    res.json({ organizations });
  } catch (err) {
    res.status(500).json({ error: { code: "UNKNOWN_ERROR", message: "Failed to fetch user organizations" } });
  }
}

export async function get(req: AuthedRequest, res: Response) {
  try {
    const org = await getOrganization(String(req.params.id));
    res.json(org);
  } catch (err) {
    const message = err instanceof Error ? err.message : "UNKNOWN_ERROR";
    if (message === "ORGANIZATION_NOT_FOUND") {
      return res.status(404).json({ error: { code: "ORGANIZATION_NOT_FOUND", message: "Organization not found" } });
    }
    res.status(500).json({ error: { code: "UNKNOWN_ERROR", message: "Failed to fetch organization" } });
  }
}

export async function update(req: AuthedRequest, res: Response) {
  try {
    const creator = await getCreatorByWallet(req.walletAddress!);
    if (!creator) {
      return res.status(404).json({ error: { code: "CREATOR_NOT_FOUND", message: "Creator profile not found" } });
    }
    const name = req.body?.name;
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Organization name is required" } });
    }

    const updated = await updateOrganization(String(req.params.id), creator.id, name.trim());
    res.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : "UNKNOWN_ERROR";
    if (message === "ORGANIZATION_NOT_FOUND") {
      return res.status(404).json({ error: { code: "ORGANIZATION_NOT_FOUND", message: "Organization not found" } });
    }
    if (message === "FORBIDDEN") {
      return res.status(403).json({ error: { code: "FORBIDDEN", message: "Not organization owner" } });
    }
    res.status(500).json({ error: { code: "UNKNOWN_ERROR", message: "Failed to update organization" } });
  }
}
