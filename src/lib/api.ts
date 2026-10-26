import type { Analytics, Report, Site } from "@/types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

// ── Auth ──────────────────────────────────────────────────────────────────────

export function getStoredUserId(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("sitelog_user_id") ?? "";
}

export function storeUserId(id: string) {
  localStorage.setItem("sitelog_user_id", id);
}

export function clearUserId() {
  localStorage.removeItem("sitelog_user_id");
}

function headers(extra?: Record<string, string>) {
  return {
    "Content-Type": "application/json",
    "X-User-Id": getStoredUserId(),
    ...extra,
  };
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try { msg = (await res.json()).error ?? msg; } catch { /* */ }
    throw new Error(msg);
  }
  return res.json();
}

// ── Sites ─────────────────────────────────────────────────────────────────────

export async function getSites(): Promise<Site[]> {
  return handle(await fetch(`${BASE}/sites`, { headers: headers() }));
}

export async function getSite(id: string): Promise<Site> {
  return handle(await fetch(`${BASE}/sites/${id}`, { headers: headers() }));
}

export async function createSite(body: {
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  target_stage?: string;
  start_date?: string;
}): Promise<Site> {
  return handle(
    await fetch(`${BASE}/sites`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(body),
    }),
  );
}

export async function updateSite(
  id: string,
  body: { name?: string; address?: string; target_stage?: string; status?: string },
): Promise<Site> {
  return handle(
    await fetch(`${BASE}/sites/${id}`, {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify(body),
    }),
  );
}

export async function deleteSite(id: string): Promise<{ deleted: boolean; id: string }> {
  return handle(
    await fetch(`${BASE}/sites/${id}`, {
      method: "DELETE",
      headers: headers(),
    }),
  );
}

// ── Reports ───────────────────────────────────────────────────────────────────

export async function getReports(params?: {
  siteId?: string;
  status?: string;
  limit?: number;
}): Promise<Report[]> {
  const q = new URLSearchParams();
  if (params?.siteId) q.set("siteId", params.siteId);
  if (params?.status) q.set("status", params.status);
  if (params?.limit)  q.set("limit", String(params.limit));
  const url = `${BASE}/reports${q.toString() ? `?${q}` : ""}`;
  return handle(await fetch(url, { headers: headers() }));
}

export async function approveReport(id: string, comment?: string): Promise<Report> {
  return handle(
    await fetch(`${BASE}/reports/${id}/approve`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ comment }),
    }),
  );
}

export async function flagReport(id: string, comment?: string): Promise<Report> {
  return handle(
    await fetch(`${BASE}/reports/${id}/flag`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ comment }),
    }),
  );
}

export async function rejectReport(id: string, comment: string): Promise<Report> {
  return handle(
    await fetch(`${BASE}/reports/${id}/reject`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ comment }),
    }),
  );
}

// ── Analytics ─────────────────────────────────────────────────────────────────

export async function getAnalytics(): Promise<Analytics> {
  return handle(await fetch(`${BASE}/analytics/summary`, { headers: headers() }));
}

export const PHOTO_URL = (path: string) =>
  path.startsWith("http") ? path : `${BASE}${path}`;

// Convenience namespace so pages can import { api } from "@/lib/api"
export const api = {
  getSites,
  getSite,
  createSite,
  updateSite,
  deleteSite,
  getReports,
  approveReport,
  flagReport,
  rejectReport,
  getAnalytics,
};
