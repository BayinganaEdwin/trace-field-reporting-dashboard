"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api, PHOTO_URL } from "@/lib/api";
import type { Report, Site, Analytics } from "@/types";
import { STAGE_LABELS } from "@/types";
import { relativeTime } from "@/lib/utils";
import { MapPin, FileText, CheckCircle, AlertTriangle } from "lucide-react";

export default function OverviewPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [reports, setReports]     = useState<Report[]>([]);
  const [sites, setSites]         = useState<Site[]>([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([api.getAnalytics(), api.getReports(), api.getSites()])
      .then(([a, r, s]) => { setAnalytics(a); setReports(r.slice(0, 5)); setSites(s); })
      .finally(() => setLoading(false));
  }, []);

  const statusBadge = (s: Report["status"]) => {
    const map: Record<string, { variant: any; label: string }> = {
      verified: { variant: "success",     label: "Verified" },
      approved: { variant: "success",     label: "Approved" },
      pending:  { variant: "warning",     label: "Pending" },
      flagged:  { variant: "destructive", label: "Flagged" },
      rejected: { variant: "outline",     label: "Rejected" },
    };
    const m = map[s] ?? { variant: "outline", label: s };
    return <Badge variant={m.variant}>{m.label}</Badge>;
  };

  if (loading) return <div className="p-6 text-muted-foreground text-sm">Loading…</div>;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Overview</h2>
        <p className="text-sm text-muted-foreground">Dashboard summary</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={MapPin}        label="Active sites"  value={analytics?.activeSites ?? sites.length} color="text-blue-600    bg-blue-50" />
        <StatCard icon={FileText}      label="Total reports" value={analytics?.totalReports ?? 0}           color="text-violet-600 bg-violet-50" />
        <StatCard icon={CheckCircle}   label="Approved"      value={analytics?.approvedReports ?? 0}        color="text-green-600  bg-green-50" />
        <StatCard icon={AlertTriangle} label="Flagged"       value={analytics?.flaggedReports ?? 0}         color="text-amber-600  bg-amber-50" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent reports</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {reports.length === 0 && (
            <p className="px-5 pb-5 text-sm text-muted-foreground">No reports yet.</p>
          )}
          <ul className="divide-y">
            {reports.map((r) => (
              <li key={r.id} className="flex items-center gap-3 px-5 py-3">
                {r.photo_urls?.[0] && (
                  <img src={PHOTO_URL(r.photo_urls[0])} alt="" className="h-10 w-10 rounded-md object-cover shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{r.site_name ?? r.site_id}</p>
                  <p className="text-xs text-muted-foreground">
                    {STAGE_LABELS[r.reported_stage] ?? r.reported_stage} · {relativeTime(r.submitted_at)}
                  </p>
                </div>
                {statusBadge(r.status)}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  const [text, bg] = color.split(" ");
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
