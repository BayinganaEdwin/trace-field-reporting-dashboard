export type UserRole = "worker" | "manager" | "owner";
export type ConstructionStage =
  | "formwork_erected"
  | "reinforcement_placed"
  | "concrete_poured"
  | "structure_complete";
export type ReportStatus =
  | "pending" | "verified" | "approved" | "flagged" | "rejected";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Site {
  id: string;
  name: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  status: string;
  target_stage: ConstructionStage | null;
  start_date: string | null;
  created_at: string;
  // enriched
  totalReports: number;
  approvedCount: number;
  flaggedCount: number;
  pendingCount: number;
  rei: number;
  currentStage: ConstructionStage | null;
}

export interface Report {
  id: string;
  site_id: string;
  site_name: string;
  submitted_by_id: string;
  reported_stage: ConstructionStage;
  status: ReportStatus;
  notes: string | null;
  photo_urls: string[];
  latitude: number | null;
  longitude: number | null;
  ai_detected_stage: ConstructionStage | null;
  ai_confidence: number | null;
  ai_observations: string | null;
  ai_model_version: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by_id: string | null;
  rejection_reason: string | null;
}

export interface Analytics {
  totalSites: number;
  activeSites: number;
  totalReports: number;
  pendingReports: number;
  approvedReports: number;
  flaggedReports: number;
  overallRei: number;
  stageDistribution: Record<ConstructionStage, number>;
  reiTrend: { date: string; rei: number | null; count: number }[];
}

export const STAGE_LABELS: Record<ConstructionStage, string> = {
  formwork_erected: "Formwork Erected",
  reinforcement_placed: "Reinforcement Placed",
  concrete_poured: "Concrete Poured",
  structure_complete: "Structure Complete",
};

export const DEMO_USERS: { id: string; name: string; role: UserRole }[] = [
  { id: "user-manager-1", name: "Fatima Nkusi", role: "manager" },
  { id: "user-owner-1",   name: "Patrick Habimana", role: "owner" },
];
