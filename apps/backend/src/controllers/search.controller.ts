import type { Request, Response } from "express";
import { search as searchService } from "../services/search.service.js";

export async function search(req: Request, res: Response) {
    const q = req.query.q as string | undefined;
    if (!q || q.length < 2) {
        return res.status(400).json({ error: { code: "QUERY_TOO_SHORT", message: "Query must be at least 2 characters" } });
    }
    const results = await searchService(q);
    res.json({ ...results, page: 1 });
}