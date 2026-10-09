# SecurAware — Divimaga Holdings

> **NEW CLEAN WINDOWS EDITION (2026-10-08):** Start with [docs/WINDOWS_FRESH_START.md](docs/WINDOWS_FRESH_START.md). This complete ZIP was rebuilt from the original Windows-ready source and includes all the integrated UI/navigation fixes. Use a separate `securaware_fresh` PostgreSQL database and new folder; **do not mix in older patches**.


An integrated, role-aware web application project for IE3072 Information Security Policy and Management. The planned Password Awareness Tester is deliberately **not included**; the application contains a labelled future-integration page for the team member's implementation.

## What is present in this source package

- React/Vite responsive blue-and-navy dashboard UI, role-dependent sidebar navigation, searchable course cards, reusable sticky-header tables with adjustable visible-row limits, dialogs and forms.
- Node.js/Express REST API and PostgreSQL schema.
- First Directing Manager account created on first deployment; employee accounts are created by administrators, not public self-registration.
- Password change, TOTP enrolment, TOTP challenge for returning users, session cookies with CSRF header, login throttling and password hashing.
- DB-backed published AUP seeded from the provided policy document; current-version acknowledgment gate, policy draft/review/CEO approval/manager publication workflow.
- Course creation, optional resources, quiz questions and server-graded attempts, role/department/user assignment, verified completion and points ledger, PDF certificates, evidence requests, deadline-extension workflow.
- Simulated phishing campaign drafting, eligible employee/department-head targets, launch/results endpoints. SMTP is OPTIONAL and disabled without configuration.
- Department/branch creation, user lifecycle, role-scoped report views, activity audit, CSV reports and notification feed.

## Start natively on Windows (without Docker)

1. Install PostgreSQL and Node.js. Create PostgreSQL user `securaware`, then database `securaware` owned by it.
2. Extract the package to e.g. `D:\Projects\SecurAware_Complete` (do not leave it inside the ZIP).
3. At the project root, in a normal PowerShell window, run `Copy-Item .env.example .env`; edit `.env`. Set `PGPASSWORD` to the password for the **securaware database user** and set a NEW long random `BOOTSTRAP_PASSWORD` (16 or more characters). Keep the `.env` private.
4. From the `server` folder execute `npm install`, then `npm start`. Wait for `SecurAware API on 4000` and verify `http://localhost:4000/api/health`. The first backend startup creates tables, initial user and published AUP.
5. In another terminal from the `client` folder execute `npm install`, then `npm run dev`. Visit `http://localhost:5173`.
6. Log in using the `BOOTSTRAP_EMAIL` and `BOOTSTRAP_PASSWORD` from `.env` and complete password change, mandatory MFA and AUP acknowledgement.

Native Windows stores uploaded files under `<project root>/uploads/`; this is a private development-only location. Keep it out of version control and back it up with PostgreSQL data if needed.

**Troubleshooting:** If PowerShell blocks `npm.ps1`, use CMD (Command Prompt) or run `npm.cmd install` / `npm.cmd start` instead. If native package compilation fails, send the exact npm error log. If database login fails, check `PGPASSWORD`, database service status and port 5432.

## Prerequisites

- Docker Desktop for Windows with WSL 2 enabled (Docker Compose plugin).
- Ports **5173** and **4000** free on localhost. No global Node installation is needed for Docker use.

## Start locally

1. Extract the ZIP into a short local Windows path, e.g. `C:\\Projects\\SecurAware`.
2. Open PowerShell in the extracted `SecurAware_Complete` directory.
3. Copy `.env.example` to `.env` and **set long random values** for `POSTGRES_PASSWORD` and `BOOTSTRAP_PASSWORD`.
4. Run:

   ```powershell
   docker compose up --build -d
   docker compose logs -f api
   ```

5. Open **http://localhost:5173**.
6. Sign in using `BOOTSTRAP_EMAIL` and `BOOTSTRAP_PASSWORD` from your `.env` file, then change the temporary password, configure MFA, acknowledge the seeded AUP and add other accounts.
7. To shut down: `docker compose down`. Database files and uploads remain in Docker volumes. **Do not run `docker compose down -v` unless you intentionally want to erase them.**

## AUP

`seed/aup.txt` contains the policy content extracted from the provided AUP DOCX, beginning at `1. Purpose & Scope` so it does not include the academic cover. It is seeded as published version 1 when the database is initialized. Future versions must be created and approved using the Policy workflow. Changing `seed/aup.txt` after initialization does not silently replace approved policy versions.

## Course resource instructions

Add a course draft, attach text or URLs, or upload files through the course builder. The file-size limit is 25 MB in this prototype. For YouTube use a supported YouTube video URL. For licensed third-party courses use links and separate authorized provider accounts; **do not store provider passwords in descriptions**. A course with internal quiz mode must contain at least one question before publication. Evidence-based completion requires independent review.

## Role rules

| Role | Course management | Policy workflow | Campaigns | Admin / visibility |
| --- | --- | --- | --- | --- |
| CEO | create/assign/learn | approve/reject | manage | organization reports |
| Directing Manager | create/assign/learn | draft/revise/publish approved | manage | primary user/organization admin |
| Assistant Manager | create/assign/learn | draft/revise/publish approved | manage | delegated admin |
| Department Head | learn, review employee evidence/extensions | read/acknowledge | target only | departmental view |
| Employee | learn and request extensions | read/acknowledge | target only | own view |

## Password-tool integration

The `Password Tester` sidebar route is intentionally an integration placeholder. Integrate your teammate's code into the React page after reviewing it for local-only processing, absence of network transmission and persistent storage of sample passwords. Account password-change feedback is separate from the educational tester.

## Important verification / limitations

**This package is a substantial integrated development implementation, not a certified production deployment.** The authoring environment did not have Docker and dependency installation timed out, so no complete Docker launch or end-to-end UI test was performed here. Review and test before submitting or exposing the application to real employee data.

Known implementation gaps to address before claiming every proposal item complete:

- A production secrets-management strategy and encryption of TOTP secrets at rest; controlled MFA recovery and robust account invitation email.
- Strengthen authorization and independent authorization of training points for self-authored/self-assigned training.
- More comprehensive department/role management editing and historical course versioning.
- Malware scanning and MIME-signature validation of uploaded resources; preview/conversion of presentations.
- Protected, production-grade SMTP sending and accurate delivery/error tracking for simulations and reminders.
- Full login/session/MFA, policy, course, report, media, privacy and API abuse testing.
- Certificate template customization, advanced scheduling and accessible WCAG verification.

**Do not deploy this prototype publicly or treat it as securely production-ready without resolving those gaps.**

## Basic verification commands

```powershell
node --check server/index.mjs
# After Docker starts:
Invoke-RestMethod http://localhost:4000/api/health
# inspect logs:
docker compose logs --tail=100 api
```

No real Divimaga credentials or sensitive client data are bundled.
