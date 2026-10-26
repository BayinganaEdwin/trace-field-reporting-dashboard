"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2 } from "lucide-react";

const DEMO_ACCOUNTS = [
  { label: "Manager", userId: "user-manager-1", name: "Fatima Nkusi" },
  { label: "Owner",   userId: "user-owner-1",   name: "Patrick Habimana" },
];

export default function LoginPage() {
  const router = useRouter();
  const [userId, setUserId] = useState("user-manager-1");
  const [error, setError] = useState("");

  function login(id: string) {
    if (!id.trim()) { setError("Enter a user ID"); return; }
    localStorage.setItem("sitelog_user_id", id.trim());
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Building2 className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">SiteLog</h1>
          <p className="text-sm text-muted-foreground">Construction reporting dashboard</p>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Sign in</CardTitle>
            <CardDescription>Enter your user ID to access the dashboard.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                placeholder="user-manager-1"
                value={userId}
                onChange={(e) => { setUserId(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && login(userId)}
              />
              {error && <p className="text-xs text-destructive">{error}</p>}
            </div>
            <Button className="w-full" onClick={() => login(userId)}>
              Sign in
            </Button>
          </CardContent>
        </Card>

        {/* Demo quick-login */}
        <div className="space-y-2">
          <p className="text-center text-xs text-muted-foreground">Quick access — demo accounts</p>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map((a) => (
              <button
                key={a.userId}
                onClick={() => login(a.userId)}
                className="rounded-lg border bg-card p-3 text-left hover:bg-accent transition-colors"
              >
                <p className="text-sm font-medium">{a.label}</p>
                <p className="text-xs text-muted-foreground">{a.name}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
