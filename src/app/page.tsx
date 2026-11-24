'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2 } from 'lucide-react';
import { loginWithEmail } from '@/lib/api';

const DEMO_ACCOUNTS = [
  { label: 'Manager', email: 'fatima@sitelog.rw', name: 'Fatima Nkusi' },
  { label: 'Owner', email: 'patrick@sitelog.rw', name: 'Patrick Habimana' },
];

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageInner />
    </Suspense>
  );
}

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get('registered') === '1';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function login(emailOverride?: string) {
    const target = (emailOverride ?? email).trim();
    if (!target) {
      setError('Email is required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const user = await loginWithEmail(target);
      localStorage.setItem('sitelog_user_id', user.id);
      localStorage.setItem('sitelog_user_name', user.name);
      localStorage.setItem('sitelog_user_role', user.role);
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Building2 className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Trace</h1>
          <p className="text-sm text-muted-foreground">
            Construction reporting dashboard
          </p>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Sign in</CardTitle>
            <CardDescription>
              Enter your email and password to continue.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                onKeyDown={(e) => e.key === 'Enter' && login()}
                autoComplete="email"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                onKeyDown={(e) => e.key === 'Enter' && login()}
                autoComplete="current-password"
              />
            </div>
            {justRegistered && (
              <p className="text-xs text-green-600 bg-green-50 rounded px-3 py-2">
                Account created — sign in below.
              </p>
            )}
            {error && <p className="text-xs text-destructive">{error}</p>}
            <Button className="w-full" onClick={() => login()} disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="underline underline-offset-2 hover:text-foreground">
                Create account
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Demo quick-login */}
        <div className="space-y-2">
          <p className="text-center text-xs text-muted-foreground">
            Quick access — demo accounts
          </p>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map((a) => (
              <button
                key={a.email}
                onClick={() => login(a.email)}
                disabled={loading}
                className="rounded-lg border bg-card p-3 text-left hover:bg-accent transition-colors disabled:opacity-50"
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
