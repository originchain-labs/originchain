"use client";

import { useAnalytics } from "@/hooks/useAnalytics";
import { LineChart } from "@/components/charts/line-chart";
import { Line } from "@/components/charts/line";
import { Grid } from "@/components/charts/grid";
import { XAxis } from "@/components/charts/x-axis";
import { ChartTooltip } from "@/components/charts/tooltip";

export default function DashboardPage() {
    const { insights, error, loading } = useAnalytics();

    if (error) return <p className="p-6 text-sm text-red-600">{error}</p>;
    if (loading || !insights) return <p className="p-6 text-sm text-zinc-500">Loading dashboard…</p>;

    return (
        <div className="mx-auto max-w-3xl p-6">
            <h1 className="mb-4 text-xl font-semibold">Your Dashboard</h1>

            {insights.aiSummary && (
                <div className="mb-6 rounded border bg-zinc-50 p-4 text-sm">
                    <p className="mb-1 text-xs font-medium uppercase text-zinc-400">AI Summary</p>
                    <p>{insights.aiSummary}</p>
                </div>
            )}

            <div className="mb-6 grid grid-cols-4 gap-3 text-center">
                <div className="rounded border p-3">
                    <p className="text-2xl font-semibold">{insights.totalAssets}</p>
                    <p className="text-xs text-zinc-500">Assets</p>
                </div>
                <div className="rounded border p-3">
                    <p className="text-2xl font-semibold">{insights.totalReviews}</p>
                    <p className="text-xs text-zinc-500">Reviews</p>
                </div>
                <div className="rounded border p-3">
                    <p className="text-2xl font-semibold">{insights.averageRating?.toFixed(1) ?? "—"}</p>
                    <p className="text-xs text-zinc-500">Avg Rating</p>
                </div>
                <div className="rounded border p-3">
                    <p className="text-2xl font-semibold">{insights.reputationScore}</p>
                    <p className="text-xs text-zinc-500">Reputation</p>
                </div>
            </div>

            <div className="mb-6">
                <h2 className="mb-2 text-sm font-medium">Assets Over Time</h2>
                <LineChart data={insights.assetsOverTime} xDataKey="date" style={{ height: 200 }}>
                    <Grid />
                    <XAxis />
                    <Line dataKey="count" />
                    <ChartTooltip />
                </LineChart>
            </div>

            <div>
                <h2 className="mb-2 text-sm font-medium">Reviews Over Time</h2>
                <LineChart data={insights.reviewsOverTime} xDataKey="date" style={{ height: 200 }}>
                    <Grid />
                    <XAxis />
                    <Line dataKey="count" />
                    <ChartTooltip />
                </LineChart>
            </div>
        </div>
    );
}