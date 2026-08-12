"use client";

import { useState, useEffect } from "react";
import { getCreatorInsights } from "@/lib/api-client";
import { getSession } from "@/lib/session";

export function useAnalytics() {
  const [insights, setInsights] = useState<Awaited<ReturnType<typeof getCreatorInsights>> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      setError("Please sign in to view your dashboard");
      setLoading(false);
      return;
    }
    getCreatorInsights(session.creatorId, session.token)
      .then(setInsights)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { insights, error, loading };
}
