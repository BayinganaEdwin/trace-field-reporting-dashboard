# Trace Field Reporting — Dashboard

Web dashboard for managers and site owners to review construction reports and monitor site progress. Built with Next.js 14.

## Getting started

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Open `http://localhost:3000`. Use one of the demo accounts on the login page to get in.

Set `NEXT_PUBLIC_API_URL` in `.env.local` to point at the backend (default: `http://localhost:3001`).

## Pages

- **Overview** — stat cards (total reports, pending, approved, flagged) and a recent activity feed
- **Reports** — searchable and filterable list; approve, flag, or reject individual reports
- **Sites** — create, edit, and delete construction sites
- **Analytics** — stage distribution bar chart and weekly submission trend

## Stack

- Next.js 14 App Router with TypeScript
- Tailwind CSS
- shadcn/ui components
- Recharts for charts
