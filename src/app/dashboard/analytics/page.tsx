"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Analytics } from "@/types";
import { STAGE_LABELS } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from "recharts";
import { FileText, CheckCircle, AlertTriangle, TrendingUp } from "lucide-react";

export default function AnalyticsPage() {
  const [data, setData]       = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAnalytics().then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-sm text-muted-foreground">Loading…</div>;
  if (!data)   return <div className="p-6 text-sm text-destructive">Failed to load analytics.</div>;

  const stageData = Object.entries(data.stageDistribution ?? {}).map(([stage, count]) => ({
    stage: STAGE_LABELS[stage as keyof typeof STAGE_LABELS] ?? stage,
    count: count as number,
  }));

  const trendData = (data.reiTrend ?? []).map((d) => ({
    date: d.date,
    submissions: d.count,
    rei: d.rei ?? 0,
  }));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Analytics</h2>
        <p className="text-sm text-muted-foreground">Site reporting metrics</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard icon={FileText}      label="Total reports" value={data.totalReports}    color="violet" />
        <KpiCard icon={CheckCircle}   label="Approved"      value={data.approvedReports} color="green" />
        <KpiCard icon={AlertTriangle} label="Flagged"       value={data.flaggedReports}  color="amber" />
        <KpiCard icon={TrendingUp}    label="REI score"     value={`${Math.round(data.overallRei ?? 0)}%`} color="blue" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Reports by stage</CardTitle></CardHeader>
          <CardContent>
            {stageData.length === 0
              ? <p className="text-sm text-muted-foreground py-6 text-center">No data yet.</p>
              : (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={stageData} margin={{ top: 0, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="stage" tick={{ fontSize: 10 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                    <Bar dataKey="count" name="Reports" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )
            }
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Submission trend</CardTitle></CardHeader>
          <CardContent>
            {trendData.length === 0
              ? <p className="text-sm text-muted-foreground py-6 text-center">No trend data yet.</p>
              : (
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={trendData} margin={{ top: 0, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                    <Line type="monotone" dataKey="submissions" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )
            }
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number | string; color: string }) {
  const colorMap: Record<string, string> = {
    violet: "text-violet-600 bg-violet-50",
    green:  "text-green-600  bg-green-50",
    amber:  "text-amber-600  bg-amber-50",
    blue:   "text-blue-600   bg-blue-50",
  };
  const cls = colorMap[color] ?? "text-primary bg-primary/10";
  const [text, bg] = cls.split(" ");
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <div className={`${bg} rounded-lg p-2`}>
          <Icon className={`h-5 w-5 ${text}`} />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
