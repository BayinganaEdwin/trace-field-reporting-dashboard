"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Site } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { MapPin, Plus, Calendar, Pencil, Trash2 } from "lucide-react";

function formatDate(str: string | null) {
  if (!str) return "—";
  return new Date(str).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

type Mode = "create" | "edit" | null;

export default function SitesPage() {
  const [sites, setSites]         = useState<Site[]>([]);
  const [loading, setLoading]     = useState(true);
  const [mode, setMode]           = useState<Mode>(null);
  const [editTarget, setEditTarget] = useState<Site | null>(null);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState("");
  const [form, setForm]           = useState({ name: "", address: "" });
  const [deleteTarget, setDeleteTarget] = useState<Site | null>(null);
  const [deleting, setDeleting]   = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    api.getSites().then(setSites).finally(() => setLoading(false));
  }, []);

  function openCreate() {
    setForm({ name: "", address: "" });
    setEditTarget(null);
    setError("");
    setMode("create");
  }

  function openEdit(site: Site) {
    setForm({ name: site.name, address: site.address ?? "" });
    setEditTarget(site);
    setError("");
    setMode("edit");
  }

  function closeDialog() {
    setMode(null);
    setEditTarget(null);
    setError("");
  }

  function patch(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setError("");
  }

  async function handleSave() {
    if (!form.name.trim())    { setError("Site name is required.");  return; }
    if (!form.address.trim()) { setError("Address is required.");    return; }
    setSaving(true);
    try {
      if (mode === "create") {
        const site = await api.createSite({ name: form.name.trim(), address: form.address.trim() });
        setSites((prev) => [site, ...prev]);
      } else if (mode === "edit" && editTarget) {
        const updated = await api.updateSite(editTarget.id, {
          name: form.name.trim(),
          address: form.address.trim(),
        });
        setSites((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      }
      closeDialog();
    } catch (e: any) {
      setError(e.message ?? "Failed to save site.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await api.deleteSite(deleteTarget.id);
      setSites((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (e: any) {
      setDeleteError(e.message ?? "Failed to delete site. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Sites</h2>
          <p className="text-sm text-muted-foreground">{sites.length} construction site{sites.length !== 1 ? "s" : ""}</p>
        </div>
        <Button onClick={openCreate} size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" /> New site
        </Button>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading…</p>}

      {!loading && sites.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
          <MapPin className="mb-3 h-8 w-8 text-muted-foreground/50" />
          <p className="font-medium">No sites yet</p>
          <p className="text-sm text-muted-foreground mt-1">Create your first construction site to get started.</p>
          <Button className="mt-4 gap-1.5" onClick={openCreate}>
            <Plus className="h-4 w-4" /> New site
          </Button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sites.map((site) => (
          <Card key={site.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base leading-snug">{site.name}</CardTitle>
                <div className="flex items-center gap-1 shrink-0">
                  <Badge variant={site.status === "active" ? "success" : "outline"}>
                    {site.status === "active" ? "Active" : site.status ?? "Inactive"}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => openEdit(site)}
                    title="Edit site"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => setDeleteTarget(site)}
                    title="Delete site"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              {site.address && (
                <CardDescription className="flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate">{site.address}</span>
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-md bg-muted p-2">
                  <p className="font-semibold text-sm">{site.totalReports ?? 0}</p>
                  <p className="text-muted-foreground">Reports</p>
                </div>
                <div className="rounded-md bg-green-50 p-2">
                  <p className="font-semibold text-sm text-green-700">{site.approvedCount ?? 0}</p>
                  <p className="text-muted-foreground">Approved</p>
                </div>
                <div className="rounded-md bg-amber-50 p-2">
                  <p className="font-semibold text-sm text-amber-700">{site.flaggedCount ?? 0}</p>
                  <p className="text-muted-foreground">Flagged</p>
                </div>
              </div>
              <p className="flex items-center gap-1 text-xs text-muted-foreground pt-1">
                <Calendar className="h-3 w-3" />
                Created {formatDate(site.created_at)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create / Edit dialog */}
      <Dialog open={mode !== null} onOpenChange={(o) => !o && closeDialog()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{mode === "create" ? "Create new site" : "Edit site"}</DialogTitle>
            <DialogDescription>
              {mode === "create"
                ? "Add a construction site that workers can report against."
                : "Update the site name or address."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="site-name">Site name *</Label>
              <Input
                id="site-name"
                placeholder="e.g. Kacyiru Office Complex"
                value={form.name}
                onChange={(e) => patch("name", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="site-address">Address *</Label>
              <Input
                id="site-address"
                placeholder="e.g. KG 5 Ave, Kacyiru, Kigali"
                value={form.address}
                onChange={(e) => patch("address", e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog} disabled={saving}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (mode === "create" ? "Creating…" : "Saving…") : (mode === "create" ? "Create site" : "Save changes")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteTarget !== null} onOpenChange={(o) => { if (!o) { setDeleteTarget(null); setDeleteError(""); } }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete site?</DialogTitle>
            <DialogDescription>
              This will permanently delete <strong>{deleteTarget?.name}</strong> and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {deleteError && <p className="text-sm text-destructive px-1">{deleteError}</p>}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setDeleteTarget(null); setDeleteError(""); }} disabled={deleting}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting…" : "Delete site"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
