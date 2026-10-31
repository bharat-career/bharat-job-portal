# Bharat Career Hub

Bharat Career Hub is a modern job portal for discovering and tracking government recruitment opportunities across India. It brings together public-sector job listings, state/department filters, eligibility guidance, and dashboard-based user and admin flows in a single application.

## Overview

This project is a React + TypeScript portal built with Vite and styled using Tailwind CSS. It allows users to:

- Browse jobs from central and state government recruitment drives
- Filter positions by category, state, department, and eligibility criteria
- Open detailed job pages with notices, deadlines, and application actions
- Use an eligibility calculator and job alert tools
- Access user and admin dashboards for personalized tracking and management
- Run in a local/demo mode when Supabase is not configured

## Features

- Job discovery and search across multiple government sectors
- Department and state-wise job directories
- Job detail pages with application and notification links
- Eligibility calculator modal for quick qualification checks
- Job alert subscriptions and notices
- Authentication flow for users and admin access
- Admin dashboard for managing listings and job records
- Supabase-backed data sync with graceful local fallback

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Supabase JavaScript client
- Google GenAI SDK
- Express (for supporting server-side integration)

## Project Structure

```text
.
├── .env.example
├── .gitignore
├── index.html
├── metadata.json
├── package.json
├── tsconfig.json
├── vite.config.ts
├── public/
├── src/
│   ├── components/
│   ├── context/
│   ├── lib/
│   ├── pages/
│   ├── services/
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── types.ts
├── supabase/
└── bun.lock
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or Bun

### Install dependencies

```bash
npm install
```

or

```bash
bun install
```

### Environment variables

Copy the example environment file:

```bash
cp .env.example .env
```

Then update the values as needed:

```env
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"
GEMINI_API_KEY="MY_GEMINI_API_KEY"
APP_URL="MY_APP_URL"
```

Note: If Supabase credentials are not configured, the app can still run in a seamless local/demo mode using realistic sample data.

### Run locally

```bash
npm run dev
```

The app is configured to run on port 3000:

- http://localhost:3000

### Build for production

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## Scripts

```json
{
  "dev": "vite --port=3000 --host=0.0.0.0",
  "build": "vite build",
  "preview": "vite preview",
  "clean": "rm -rf dist server.js",
  "lint": "tsc --noEmit"
}
```

## Notes

- The repository is a frontend application focused on public sector career discovery.
- Supabase integration is used for data persistence and synchronization when available.
- The app includes both public and administrative user flows, making it suitable for recruitment portals and job board dashboards.

## License

This project does not currently declare a license file in the repository root. If you plan to publish or distribute the project, add an appropriate open-source license before doing so.
