"use client";
import { useEffect, useState } from "react";
import { api, PHOTO_URL } from "@/lib/api";
import type { Report } from "@/types";
import { STAGE_LABELS } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { relativeTime } from "@/lib/utils";
import { CheckCircle, Flag, XCircle, Search } from "lucide-react";

export default function ReportsPage() {
  const [reports, setReports]         = useState<Report[]>([]);
  const [loading, setLoading]         = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch]           = useState("");
  const [selected, setSelected]       = useState<Report | null>(null);
  const [action, setAction]           = useState<"approve" | "flag" | "reject" | null>(null);
  const [comment, setComment]         = useState("");
  const [saving, setSaving]           = useState(false);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    api.getReports().then(setReports).finally(() => setLoading(false));
  }, []);

  const filtered = reports.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!r.site_id.toLowerCase().includes(q) && !(r.site_name ?? "").toLowerCase().includes(q) && !r.reported_stage.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  function openAction(report: Report, type: "approve" | "flag" | "reject") {
    setSelected(report);
    setAction(type);
    setComment("");
    setActionError("");
  }

  async function submitAction() {
    if (!selected || !action) return;
    if ((action === "flag" || action === "reject") && !comment.trim()) {
      setActionError("A comment is required for this action.");
      return;
    }
    setSaving(true);
    try {
      let updated: Report;
      if (action === "approve")      updated = await api.approveReport(selected.id, comment.trim() || undefined);
      else if (action === "flag")    updated = await api.flagReport(selected.id, comment.trim());
      else                           updated = await api.rejectReport(selected.id, comment.trim());
      setReports((prev) => prev.map((r) => r.id === updated.id ? updated : r));
      setAction(null);
      setSelected(null);
    } catch (e: any) {
      setActionError(e.message ?? "Action failed.");
    } finally {
      setSaving(false);
    }
  }

  const statusBadge = (s: Report["status"]) => {
    const map: Record<string, any> = {
      verified: "success", approved: "success", pending: "warning",
      flagged: "destructive", rejected: "outline",
    };
    return <Badge variant={map[s] ?? "outline"} className="capitalize shrink-0">{s}</Badge>;
  };

  const canAction = (r: Report) => r.status === "pending" || r.status === "verified";

  return (
    <div className="p-6 space-y-5">
      <div>
        <h2 className="text-xl font-semibold">Reports</h2>
        <p className="text-sm text-muted-foreground">{filtered.length} report{filtered.length !== 1 ? "s" : ""}</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-40">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input className="pl-8" placeholder="Search site, stage…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36"><SelectValue placeholder="All statuses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="flagged">Flagged</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {!loading && filtered.length === 0 && (
        <div className="py-16 text-center"><p className="text-muted-foreground">No reports found.</p></div>
      )}

      <div className="space-y-3">
        {filtered.map((report) => (
          <Card key={report.id} className="hover:shadow-sm transition-shadow">
            <CardContent className="p-4 flex gap-4">
              {report.photo_urls?.[0] && (
                <img
                  src={PHOTO_URL(report.photo_urls[0])}
                  alt=""
                  className="h-16 w-16 rounded-lg object-cover shrink-0 cursor-pointer"
                  onClick={() => setSelected(report)}
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-sm">{report.site_name ?? report.site_id}</p>
                    <p className="text-xs text-muted-foreground">
                      {STAGE_LABELS[report.reported_stage] ?? report.reported_stage} · {relativeTime(report.submitted_at)}
                    </p>
                    {report.ai_detected_stage && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        AI: {STAGE_LABELS[report.ai_detected_stage] ?? report.ai_detected_stage}
                        {report.ai_confidence != null && ` (${Math.round(report.ai_confidence * 100)}%)`}
                      </p>
                    )}
                  </div>
                  {statusBadge(report.status)}
                </div>
              </div>
              {canAction(report) && (
                <div className="flex flex-col gap-1.5 shrink-0">
                  <Button size="sm" variant="outline" className="gap-1 text-green-700 border-green-200 hover:bg-green-50" onClick={() => openAction(report, "approve")}>
                    <CheckCircle className="h-3.5 w-3.5" /> Approve
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1 text-amber-700 border-amber-200 hover:bg-amber-50" onClick={() => openAction(report, "flag")}>
                    <Flag className="h-3.5 w-3.5" /> Flag
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1 text-red-700 border-red-200 hover:bg-red-50" onClick={() => openAction(report, "reject")}>
                    <XCircle className="h-3.5 w-3.5" /> Reject
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action dialog */}
      <Dialog open={!!action} onOpenChange={() => setAction(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="capitalize">{action} report</DialogTitle>
            <DialogDescription>
              {action === "approve" && "Mark this report as approved."}
              {action === "flag"    && "Flag this report for follow-up. A comment is required."}
              {action === "reject"  && "Reject this report. A comment is required."}
            </DialogDescription>
          </DialogHeader>
          {selected?.photo_urls?.[0] && (
            <img src={PHOTO_URL(selected.photo_urls[0])} alt="" className="w-full h-40 object-cover rounded-lg" />
          )}
          <div className="space-y-1.5">
            <Label htmlFor="comment">Comment{action !== "approve" ? " *" : ""}</Label>
            <Textarea
              id="comment"
              rows={3}
              placeholder={action === "approve" ? "Optional note…" : "Explain the reason…"}
              value={comment}
              onChange={(e) => { setComment(e.target.value); setActionError(""); }}
            />
            {actionError && <p className="text-sm text-destructive">{actionError}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAction(null)} disabled={saving}>Cancel</Button>
            <Button disabled={saving} onClick={submitAction} variant={action === "reject" ? "destructive" : "default"}>
              {saving ? "Saving…" : `Confirm ${action}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
