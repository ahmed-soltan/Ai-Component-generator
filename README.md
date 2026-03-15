# Overview 

## Purpose and Scope
The AI Component Generator is a full-stack web application that enables users to generate, customize, and manage UI components using artificial intelligence. The system provides a freemium SaaS model with subscription-based feature gating, real-time component preview, and code export capabilities.

This document covers the overall system architecture, core technologies, and high-level component interactions. For detailed information about specific subsystems, see Component Generation System, Authentication System, Subscription Management, and API Reference.

## System Architecture Overview

![Screenshot (494)](https://github.com/user-attachments/assets/96ef4dbf-f0e0-4171-a406-346904639d2c)

<br/>

## What It Does

- Auth flow with sign up, sign in, sign out, and current-session lookup
- Prompt-based UI generation with live streaming responses from Gemini
- Component customization by framework, CSS system, layout, theme, radius, and shadow
- Live preview and editing workflow built around Sandpack
- Saved components library with filtering and detail pages
- Per-user preferences for default generation settings
- Subscription checkout and cancellation with Lemon Squeezy
- Usage and performance analytics for paid users

## Current Stack

- Next.js 14 with React 18 and App Router
- TypeScript
- Hono for API handlers mounted under `/api`
- Appwrite for authentication and database documents
- Google Gemini via `@langchain/google-genai`
- TanStack Query for client-side server state
- Zustand for component-generation state
- Tailwind CSS, Radix UI, and shadcn/ui primitives
- Sandpack for live code preview
- Lemon Squeezy for billing and subscription webhooks

## Generation Options

The generator currently supports:

- JavaScript frameworks: React, Vue, Angular, Vanilla
- CSS frameworks: Tailwind, Bootstrap, plain CSS
- Layout modes: Flex, Grid
- Themes: Earthy, Minimalist, Vibrant, Pastel, Dark
- Style controls: border radius and shadow presets

## Product Areas

### Public pages

- Landing page with marketing sections and pricing
- Dedicated pricing page
- Authentication screens

### Authenticated dashboard

- Generate component
- Generated components list and component detail view
- Subscription management
- Settings and preference defaults
- Support center
- Usage and performance analytics

## API Surface

The Hono app is mounted in `src/app/api/[[...route]]/route.ts` and exposes these main route groups:

- `/api/auth` for session and profile operations
- `/api/plans` for pricing plans
- `/api/component` for generation, save, update, fetch, and listing
- `/api/settings` for updating default user preferences
- `/api/subscription` for checkout, cancellation, and current subscription
- `/api/performance` for analytics
- `/api/generation` for generation analytics features

There is also a webhook endpoint at `/api/webhooks/lemonsqueezy`.

## Project Structure

```text
src/
	app/
		(root)/                Public marketing pages
		auth/                  Sign-in and sign-up screens
		dashboard/             Authenticated product area
		api/                   Hono entrypoint and webhooks
	components/             Shared UI and layout components
	features/
		auth/                  Auth API, queries, types, schemas
		component/             Generator forms, preview, server logic, store
		generation-analytics/  Analytics-related feature code
		home/                  Marketing and plan data
		performance/           Request metrics and analytics
		settings/              User preference management
		subscription/          Billing flows and subscription UI
		support-center/        Help center data and components
	hooks/                   Shared React hooks
	lib/                     Appwrite, RPC client, session middleware, utilities
	config.ts                Appwrite collection/database IDs from env
```

## Requirements

- Node.js 20 or newer is recommended
- pnpm
- An Appwrite project with the required collections/documents
- A Gemini API key
- A Lemon Squeezy store and webhook configuration if you want billing enabled

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Create your environment file

Create a `.env.local` file in the project root and populate the variables below.

```env
NEXT_PUBLIC_API_URL=http://localhost:3000

NEXT_PUBLIC_APPWRITE_ENDPOINT=
NEXT_PUBLIC_APPWRITE_PROJECT=
NEXT_APPWRITE_KEY=

NEXT_PUBLIC_APPWRITE_DATABASES_ID=
NEXT_PUBLIC_APPWRITE_PLANS_ID=
NEXT_PUBLIC_APPWRITE_PROFILES_ID=
NEXT_PUBLIC_APPWRITE_PROJECTS_ID=
NEXT_PUBLIC_APPWRITE_COMPONENTS_ID=
NEXT_PUBLIC_APPWRITE_AI_REQUESTS_ID=
NEXT_PUBLIC_APPWRITE_PERFORMANCE_ID=
NEXT_PUBLIC_APPWRITE_PREFERENCES_ID=
NEXT_PUBLIC_APPWRITE_SUBSCRIPTIONS_ID=

GEMINI_API_KEY=

LEMON_SQUEEZY_API_KEY=
LEMON_SQUEEZY_STORE_ID=
LEMON_SQUEEZY_PRO_PLAN_VARIANT_ID=
LEMON_SQUEEZY_ENTERPRISE_PLAN_VARIANT_ID=
LEMONSQUEEZY_SIGNING_SECRET=
```

### 3. Start the development server

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Scripts

- `pnpm dev` starts the local development server
- `pnpm build` builds the production app
- `pnpm start` runs the production server
- `pnpm lint` runs the configured Next.js lint command

## Appwrite Setup Notes

This project expects Appwrite to handle both auth and document storage.

At minimum, the app references these logical collections:

- plans
- profiles
- projects
- components
- ai requests
- performance
- preferences
- subscriptions

The actual IDs are read from environment variables in `src/config.ts`.

On sign-up, the backend creates:

- a profile document
- a preferences document keyed by the user id

## Subscription Behavior

- Free users are restricted compared to paid plans
- The generation API currently enforces monthly request limits for free and pro users
- Checkout and cancellation are handled through Lemon Squeezy API calls
- Subscription status updates are finalized through the Lemon Squeezy webhook endpoint

## Implementation Notes

- Generated code is streamed from Gemini and cleaned before save/update to remove fenced code blocks
- API requests are tracked in the performance collection for analytics
- Preference defaults are used to prefill the generation form in the dashboard
- Authenticated API access is enforced through session middleware backed by Appwrite sessions

## Deployment Notes

- The API route is configured for the Node.js runtime
- Production requires all Appwrite, Gemini, and Lemon Squeezy variables to be set
- The Lemon Squeezy webhook must point to `/api/webhooks/lemonsqueezy`

## Known Caveat

The existing codebase contains some plan-rule messaging and fallback behavior that are not fully consistent across all handlers. This README documents the overall intended setup and runtime dependencies rather than every edge-case implementation detail.
