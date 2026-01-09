# AI Coding Agent Instructions

## Project Overview

This is a **React + TypeScript + Vite** application for "BeforeWedding" - a pre-marriage counseling platform with separate user and counselor portals. The project uses **React Router** for client-side routing, **Radix UI** primitives, and **Tailwind CSS v4** for styling.

## Architecture

### Dual Portal System
- **Public/User Portal**: Landing page, counselor browsing, booking, dashboard for couples
- **Counselor Portal**: Separate dashboard (`/counselor-dashboard`) with schedule management, client tracking, and earnings

### Routing Structure
All routes defined in [src/App.tsx](../src/App.tsx):
- Public routes: `/`, `/login`, `/signup`, `/counselors`
- Counselor routes: `/counselor-application`, `/counselor-login`, `/counselor-dashboard`
- Protected user routes: `/dashboard`, `/booking/:counselorId`, `/assessment/:categoryId`

### Component Organization
- `src/components/` - Shared landing page components (Hero, Features, Testimonials, etc.)
- `src/components/counselor/` - Counselor dashboard components with barrel export in [index.ts](../src/components/counselor/index.ts)
- `src/components/ui/` - Radix UI wrappers using shadcn/ui patterns
- `src/pages/` - Route-level page components
- `src/pages/counselor/` - Counselor-specific pages

## Styling System

### Custom CSS Variables (NOT Tailwind Default)
**CRITICAL**: The counselor portal uses custom brand color variables defined at the bottom of [src/styles/globals.css](../src/styles/globals.css):
- Brand colors: `--color-primary-blue` (#14213d), `--color-primary-teal` (#0d7377), `--color-light-teal` (#32e0c4), `--color-accent-teal` (#0a5f62)
- Semantic: `--color-text-dark` (#1a2332), `--color-text-gray` (#64748b), `--color-text-muted` (#94a3b8)
- Backgrounds: `--color-bg-light` (#f8fafb), `--color-bg-white` (#ffffff)
- UI: `--color-border` (#e2e8f0)
- State colors: `--color-success` (#10b981), `--color-warning` (#f59e0b), `--color-error` (#ef4444)

Example usage from [Sidebar.tsx](../src/components/counselor/Sidebar.tsx#L19-L22):
```tsx
className="border-r border-[var(--color-border)]"
className="text-[var(--color-primary-blue)]"
className="bg-[var(--color-primary-teal)]"
```

**Use these custom variables for counselor portal components** to maintain brand consistency. General app variables in the same file include: `--primary` (#8B5CF6), `--border`, `--background`, `--foreground`, etc.

### Tailwind CSS v4 Notes
- Uses `@theme inline` directive for custom property integration
- Colors: Use utility classes like `bg-purple-600`, `text-gray-700` OR custom vars `bg-[var(--color-*)]`
- Radius: Custom `--radius` variable (0.625rem) used throughout

### shadcn/ui Pattern
UI components follow shadcn/ui conventions:
- Import Radix primitives with version aliases: `@radix-ui/react-dialog@1.1.6`
- Use `cn()` utility from `./utils` for className merging
- Component variants via `class-variance-authority` (see [button.tsx](../src/components/ui/button.tsx))

## Development Workflow

### Setup & Commands
```bash
npm i                # Install dependencies
npm run dev          # Start dev server (Vite)
npm run build        # Production build
```

### Vite Configuration
[vite.config.ts](../vite.config.ts) includes version-specific aliases for all dependencies. Do NOT modify import paths - they're pre-configured.

### Path Aliases
Use `@/` for src imports: `import { Button } from '@/components/ui/button'`

## Deployment to Firebase

### Initial Firebase Setup
1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Initialize Firebase project** (if not already done):
   ```bash
   firebase init hosting
   ```
   - Select your Firebase project or create new one
   - Set public directory to `build`
   - Configure as single-page app: Yes
   - Don't overwrite existing files

3. **Update `.firebaserc`** with your project ID:
   ```json
   {
     "projects": {
       "default": "your-firebase-project-id"
     }
   }
   ```

### Manual Deployment
```bash
npm run build
firebase deploy --only hosting
```

### GitHub Actions Deployment
The project includes automated deployment via [`.github/workflows/firebase-deploy.yml`](../workflows/firebase-deploy.yml):

**Required GitHub Secrets** (Settings → Secrets → Actions):
1. `FIREBASE_SERVICE_ACCOUNT` - Firebase service account JSON
   - Generate: Firebase Console → Project Settings → Service Accounts → Generate new private key
   
2. `FIREBASE_PROJECT_ID` - Your Firebase project ID (e.g., `duringcourtship-prod`)

3. `VITE_API_BASE_URL` - Backend API URL (e.g., `http://3.107.197.17/api`)

**Workflow Behavior:**
- **Pull Requests**: Creates preview deployment (expires in 7 days)
- **Push to main**: Deploys to production (`live` channel)

### Firebase Configuration Files
- `firebase.json` - Hosting config with SPA rewrites and cache headers
- `.firebaserc` - Project alias configuration

## Common Patterns

### Component Structure
1. **Stateful page components** pass callbacks to children (see [Home.tsx](../src/pages/Home.tsx) - `onOpenDemo` prop)
2. **Dashboard components** use props for data and actions (see [DashboardOverview.tsx](../src/components/counselor/DashboardOverview.tsx))
3. **UI components** are presentational with variant props

### State Management
- React `useState` for local state
- No global state library (no Redux/Zustand)
- Authentication tokens in `localStorage`: `access_token`, `refresh_token`

### Data Patterns
Components use inline mock data (arrays of objects) for demonstration:
```tsx
const upcomingAppointments = [
  { id: "1", coupleName: "Sarah & James", date: "Dec 12, 2025", ... },
  // ...
];
```

### API Integration
**Backend Deployment:**
- **Development**: `http://localhost:8000` (local backend)
- **Production**: `http://3.107.197.17/api` (AWS deployed)

Backend URL resolution from env: `import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'`

To connect to deployed backend, set environment variable:
```bash
VITE_API_BASE_URL=http://3.107.197.17/api npm run dev
```

**Authentication Token Management:**
- User tokens: `access_token`, `refresh_token` (localStorage)
- Counselor tokens: `counselor_access_token`, `counselor_refresh_token` (localStorage)
- Always include: `Authorization: Bearer {token}` header for protected routes

**Authentication Endpoints:**
- `POST /api/auth/register/` - User signup ([Signup.tsx](../src/pages/Signup.tsx))
  - Request: `{ first_name, last_name, email, password, phone, dateOfBirth, gender: 'M'|'F'|'O'|'P', ... }`
  - Response: `{ message, user }`
  
- `POST /api/auth/login/` - User login ([Login.tsx](../src/pages/Login.tsx))
  - Request: `{ email, password }`
  - Response: `{ access_token, refresh_token, user: { email_verified, ... } }`
  - Tokens stored: `localStorage.setItem('access_token', ...)` / `refresh_token`

- `POST /api/auth/counselor/register/` - Counselor application ([CounselorApplication.tsx](../src/pages/CounselorApplication.tsx))
  - Request: `{ firstName, lastName, email, password, credentials, licenseNumber, specializations: [], ... }`
  - Response: 201 Created or 400 with validation errors

- `POST /api/auth/counselor/login/` - Counselor login ([CounselorLoginPage.tsx](../src/pages/CounselorLoginPage.tsx))
  - Request: `{ email, password }`
  - Response: `{ access_token, refresh_token, user }`
  - Tokens stored: `localStorage.setItem('counselor_access_token', ...)` / `counselor_refresh_token`

**Counselor Endpoints:**
- `GET /api/counselors/dashboard/` - Dashboard data ([CounselorDashboard.tsx](../src/pages/CounselorDashboard.tsx))
  - Headers: `Authorization: Bearer {counselor_access_token}`
  - Response: `{ id, professional_name, specialties: [], hourly_rate, total_earnings, pending_balance, upcoming_appointments_count, ... }`

- `GET /api/counselors/{id}/` - Public counselor profile
  - Response: Counselor details for booking

- `GET /api/counselors/appointments/` - All appointments with filtering ([AppointmentsView.tsx](../src/components/counselor/views/AppointmentsView.tsx))
  - Headers: `Authorization: Bearer {counselor_access_token}`
  - Response: Array of `{ id, coupleName, date, time, sessionType, status, sessionNumber, totalSessions, notes }`

- `GET /api/counselors/appointments/upcoming/` - Upcoming appointments ([DashboardOverview.tsx](../src/components/counselor/DashboardOverview.tsx))
  - Headers: `Authorization: Bearer {counselor_access_token}`
  - Response: Array of upcoming appointments (next 3-5)

- `PATCH /api/counselors/appointments/{id}/` - Update appointment status
  - Headers: `Authorization: Bearer {counselor_access_token}`
  - Request: `{ status: 'confirmed' | 'completed' | 'cancelled' }`
  - Response: Updated appointment object

- `DELETE /api/counselors/appointments/{id}/` - Cancel appointment
  - Headers: `Authorization: Bearer {counselor_access_token}`
  - Response: 204 No Content

- `POST /api/counselors/onboarding/` - Submit onboarding data ([OnboardingForm.tsx](../src/components/counselor/OnboardingForm.tsx))
  - Headers: `Authorization: Bearer {counselor_access_token}`
  - Request: Personal info, credentials, education, expertise, languages, session rate
  - Response: `{ message, profile }`

**Couples/Partner Endpoints:**
- `POST /api/couples/invite/` - Send partner invitation ([PartnerInvitation.tsx](../src/pages/PartnerInvitation.tsx))
  - Headers: `Authorization: Bearer {access_token}`
  - Request: `{ email }`
  - Response: `{ message, invitation_id, is_resend }`

- `POST /api/couples/invitations/{id}/resend/` - Resend invitation
- `POST /api/couples/invitations/{id}/cancel/` - Cancel invitation

**Support Endpoint:**
- `POST /api/support/contact/` - Submit help/support request ([Help.tsx](../src/pages/Help.tsx))
  - Headers: `Authorization: Bearer {access_token}`
  - Request: `{ name, email, subject, message }`
  - Response: `{ message }`

**Booking System Endpoints:**
- `GET /api/counselors/{id}/` - Get counselor details for booking ([BookingPage.tsx](../src/pages/BookingPage.tsx))
  - Response: `{ id, professional_name, hourly_rate, specialties: [], ... }`

- `GET /api/counselors/{id}/availability/` - Get counselor availability ([CounselorCalendar.tsx](../src/components/CounselorCalendar.tsx))
  - Query: `?date=YYYY-MM-DD`
  - Response: `[{ date, start_time, end_time, is_available }, ...]`

- `POST /api/bookings/` - Create booking request ([BookingPage.tsx](../src/pages/BookingPage.tsx))
  - Headers: `Authorization: Bearer {access_token}`
  - Request: `{ counselor_id, appointment_type: 'single'|'couple', session_type: 'video'|'in-person', session_duration: 50|80, preferred_date, preferred_time, alternate_date?, alternate_time?, concerns, goals, previous_counseling, urgency_level, additional_notes?, status: 'pending' }`
  - Response: `{ id, ...booking_details }`

- `PATCH /api/bookings/{id}/` - Update booking status ([Payment.tsx](../src/pages/Payment.tsx))
  - Headers: `Authorization: Bearer {access_token}`
  - Request: `{ status: 'confirmed', payment_id }`
  - Response: Updated booking object

**Payment Endpoints:**
- `POST /api/payments/` - Process payment ([Payment.tsx](../src/pages/Payment.tsx))
  - Headers: `Authorization: Bearer {access_token}`
  - Request: `{ booking_id, amount, payment_method: 'card', card_number, card_name, expiry_date, cvv, billing_zip }`
  - Response: `{ id, status: 'succeeded', transaction_id, ... }`

**Error Handling Pattern:**
```tsx
const response = await fetch(url, options);
const data = await response.json();
if (!response.ok) {
  setError(data.error || data.detail || 'Operation failed');
  return;
}
// Success handling
```

## Counselor Portal Specifics

### Navigation Pattern
[CounselorDashboard.tsx](../src/pages/CounselorDashboard.tsx) uses:
- `<Sidebar>` for menu with `activeItem` state
- Conditional view rendering based on `activeView` state
- Fixed sidebar layout: `w-64 fixed left-0`

### Charts
Uses **Recharts** via shadcn/ui wrapper [chart.tsx](../src/components/ui/chart.tsx):
- Define `ChartConfig` for colors/labels
- Use `<ChartContainer>` wrapper for theming
- See [EarningsChart.tsx](../src/components/counselor/charts/EarningsChart.tsx) for examples

## Critical Rules

1. **Always use custom color variables** for brand colors in counselor portal
2. **Maintain barrel exports** in `src/components/counselor/index.ts` when adding new components
3. **Keep page-level routing logic in App.tsx** - don't create nested routers
4. **Match existing data structure patterns** for mock data consistency
5. **Use Radix UI version aliases** exactly as configured in vite.config.ts
6. **Never modify src/index.css directly** - it's auto-generated by Tailwind CSS v4

## File Naming
- Components: PascalCase (`DashboardOverview.tsx`)
- Pages: PascalCase (`CounselorDashboard.tsx`)
- UI components: lowercase-hyphen (`button.tsx`, `alert-dialog.tsx`)

## Notes
- `src/App.tsx.backup` exists - ignore it
- `src/guidelines/Guidelines.md` is a template, not project documentation
- Project originated from Figma design: https://www.figma.com/design/OAiYqkcIyi3V2HiRLCSNKl
