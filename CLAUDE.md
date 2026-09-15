# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository structure

This is not a git repository (no `.git` at the root). It contains two independently-run projects with no shared build:

- `carbon-tracker/` — Spring Boot 4.1.1 (Java 17) REST API backend
- `frontend/` — React 19 + Vite SPA

They communicate over HTTP only; there is no shared code, monorepo tooling, or workspace config linking them.

## Backend (`carbon-tracker/`)

### Commands

Run all commands from the `carbon-tracker/` directory.

```
./mvnw spring-boot:run        # run the API (default port 8080; no server.port override configured)
./mvnw clean install          # build
./mvnw test                   # run all tests
./mvnw test -Dtest=ClassName  # run a single test class
```

On Windows use `mvnw.cmd` instead of `./mvnw`.

### Database

- MySQL, database name `c02`. Connection is configured via env vars `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` (see `src/main/resources/application.properties`), with a local `.env` providing defaults for development.
- `spring.jpa.hibernate.ddl-auto=update` and `spring.flyway.enabled=false` — schema is managed by Hibernate auto-update, not Flyway, even though `src/main/resources/db/migration/V1__init_schema.sql` still exists and Flyway dependencies are still on the classpath. This was switched from Flyway/`validate` at some point; the migration file is now unused/historical. Don't re-enable Flyway without baselining — the live dev DB has tables but no `flyway_schema_history`, so a naive re-enable will fail with "found non-empty schema."
- Reference data (`emission_factors`, `badges`) is seeded via `src/main/resources/data.sql`, which runs on every startup (`spring.sql.init.mode=always`, `spring.jpa.defer-datasource-initialization=true` so it runs after Hibernate creates the schema). It's idempotent — `INSERT IGNORE` for `emission_factors` (has a unique key on category/activity_type/unit) and a `WHERE NOT EXISTS` guard for `badges` (no unique key). If you add new emission factor rows, add them here, not to the unused Flyway migration.

### Architecture

Standard layered Spring MVC structure under `com.carbon.carbon_tracker`:

- `controller/` — REST endpoints, all under `/api/v1/**` (`AuthController`, `ActivityController`, `AnalyticsController`)
- `service/` — business logic (`ActivityService`, `AnalyticsService`); controllers call these, never repositories directly (except `AuthController`, which uses `UserRepository` directly for login/register)
- `repository/` — Spring Data JPA interfaces
- `entity/` — JPA entities (`User`, `Organization`, `ActivityLog`, `EmissionFactor`, `Goal`, `Badge`, `UserBadge`)
- `dto/` — request/response payloads
- `security/` — JWT auth: `JwtUtil` (sign/parse HS256 tokens), `JwtRequestFilter` (reads `Authorization: Bearer` header, populates `SecurityContext`), `CustomUserDetailsService` (loads `User` by email), `SecurityConfig` (filter chain, CORS, password encoder)
- `exception/GlobalExceptionHandler` — `@RestControllerAdvice` mapping `AuthenticationException`→401, `AccessDeniedException`→403, `NoSuchElementException`→404, other `RuntimeException`→400, anything else→500, all with a JSON `{"message": ...}` body. This exists specifically so uncaught exceptions resolve *inside* the Spring MVC dispatch. Without it, an uncaught exception triggers Tomcat's `/error` forward, which re-enters the Spring Security filter chain as an anonymous request and gets rejected by `Http403ForbiddenEntryPoint` — i.e. every server-side bug looks like an opaque, bodyless 403 instead of its real status. Keep new failure paths going through `RuntimeException` (or a more specific handled type) rather than adding raw try/catch-and-swallow in controllers.

Key domain flow: an `ActivityLog` is created from quantity + `EmissionFactor` (looked up by category/activity type/unit) to produce `calculated_co2e`. `AnalyticsService` aggregates `ActivityLog.calculated_co2e` over date ranges (today/week/month, plus previous week for comparison) and by category, scoped to the authenticated user via `Authentication.getName()` (the JWT subject = user email). `ActivityService.deleteActivity` checks the log's owner against the authenticated user's email before deleting (`AccessDeniedException` otherwise) — don't remove this check, it's the only thing preventing one user from deleting another user's logs by ID.

### Auth model

- Stateless JWT auth (`SessionCreationPolicy.STATELESS`); no server-side sessions.
- Two roles: `USER` and `ORGANIZATION`, stored as a plain string column on `User` (not a separate table) and exposed to Spring Security as `ROLE_<role>`.
- `/api/v1/auth/**` is public; `/api/v1/organization/**` requires `ROLE_ORGANIZATION`; everything else requires authentication.
- Registration defaults/normalizes any invalid role to `USER`.

## Frontend (`frontend/`)

### Commands

Run all commands from the `frontend/` directory.

```
npm run dev        # start Vite dev server
npm run build       # production build to dist/
npm run lint         # oxlint
npm run preview      # preview the production build
```

There is no configured test runner in this project.

### Architecture

- Routing (`src/App.jsx`, react-router-dom v7): `/login` and `/register` are standalone; all other routes render inside `DashboardLayout` (`src/layouts/DashboardLayout.jsx`, with `Navbar`/`Sidebar`). `ProtectedRoute` gates routes on a `token` in `localStorage`, and optionally on a `role` value (`USER` or `ORGANIZATION`) also read from `localStorage`.
- API calls go through a shared axios instance (`src/api/axiosConfig.js`) that attaches `Authorization: Bearer <token>` from `localStorage` on every request. `baseURL` is `http://localhost:8080/api/v1`, matching the backend's default port (8080, no `server.port` override configured) — keep them in sync if that ever changes.
- Pages live flat under `src/pages/` (`Dashboard`, `Activity`, `Goals`, `Leaderboard`, `Profile`, `OrganizationDashboard`, `Login`, `Register`), one per route. Of these, only `Login`, `Register`, `Dashboard`, and `Activity` actually call the backend API — `Goals`, `Leaderboard`, and `OrganizationDashboard` are static placeholder components with no corresponding backend controllers (no `GoalController`/`LeaderboardController`/org-dashboard endpoint exists yet), so there's nothing to wire them to.
- `Activity.jsx`'s category tabs (Transport/Electricity/Food/Shopping) each carry their own `activityType` options and `unit`, matching exactly the `(category, activity_type, unit)` combinations seeded in `emission_factors` (see `data.sql`) — the backend does an exact-match lookup on those three fields and 400s with "Emission factor not found" otherwise, so if you add a category/type option in the UI, add the matching emission factor row too, and vice versa.
- `Dashboard.jsx` fetches `/analytics/summary` and `/analytics/categories` for the stat tiles and category pie chart; the weekly trend line chart, goal-progress bar, peer benchmark, and tips list remain hardcoded mock data since there's no backing endpoint (no goals/benchmarking feature exists yet).
- Styling: Tailwind CSS v4 via `@tailwindcss/vite` (no separate `tailwind.config.js` needed for v4's plugin-based setup).
- Linting: oxlint (`.oxlintrc.json`), not ESLint.

## Known gaps to be aware of

- `carbon-tracker/.env` and `application.properties` contain a real-looking DB password in plaintext; treat as sensitive, don't propagate it elsewhere, and don't commit it if this project is ever put under version control.
- `JwtUtil`'s signing secret is hardcoded in source rather than externalized via config/env.
- `SecurityConfig`'s CORS policy allows `allowedOrigins("*")` — fine for local dev, worth tightening before any real deployment.
- Goals, Leaderboard, and Organization dashboard are frontend-only placeholders with no backend support (see Frontend Architecture above) — building those out is a real feature addition, not a bug fix.
