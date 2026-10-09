# SecurAware – clean Windows installation and acceptance testing

This project is a **complete source project**, not an incremental patch. Do not merge folders from older fixes into it. Use **a new project directory** and **a separate PostgreSQL database** so previously tested data is left untouched.

## A. Preserve your current work

1. Leave the current `securaware` PostgreSQL database alone until the fresh project has passed acceptance tests. Deleting an old source folder does **not** delete a PostgreSQL database, and conversely database data is not backed up by copying project files.
2. Back up your old private `.env` somewhere secure **without uploading or sending it**; do **not** copy it into this fresh project unchanged. Back up any `uploads` files you want to keep.
3. Extract the new ZIP to a new location such as `D:\SecurAware_Fresh\SecurAware_Complete`. It must contain `client`, `server`, `seed`, `docs`, `index.html` under client, and `.env.example`.

## B. Create a fresh database in SQL Shell (psql)

If PostgreSQL already has the role `securaware` from your previous successful installation, open **SQL Shell (psql)**, connect as the `postgres` superuser and run:

```sql
CREATE DATABASE securaware_fresh OWNER securaware;
\c securaware_fresh securaware
SELECT current_database(), current_user;
```

If you are installing PostgreSQL from scratch and the `securaware` role doesn't exist, first create it with a strong password of your choosing (do not share the password):

```sql
CREATE USER securaware WITH PASSWORD 'REPLACE_WITH_PRIVATE_STRONG_PASSWORD';
CREATE DATABASE securaware_fresh OWNER securaware;
```

**Do not re-run** `CREATE USER` if the role exists; PostgreSQL will report that it already exists. Do not use `DROP DATABASE`, `DROP ROLE`, or Docker `down -v` to prepare this clean test.

## C. Configure private environment file

In normal CMD at the **project root**:

```cmd
copy .env.example .env
notepad .env
```

Make sure the following values match your local machine:

```dotenv
PGHOST=localhost
PGPORT=5432
PGDATABASE=securaware_fresh
PGUSER=securaware
PGPASSWORD=YOUR_EXISTING_SECURaWARE_DATABASE_USER_PASSWORD
BOOTSTRAP_EMAIL=your-real-authorized-test-email@example.com
BOOTSTRAP_NAME=Your Full Name
BOOTSTRAP_PASSWORD=A_NEW_UNIQUE_RANDOM_PASSWORD_AT_LEAST_16_CHARACTERS
PORT=4000
NODE_ENV=development
APP_ORIGIN=http://localhost:5173
```

Do not copy this example block blindly. Enter your actual private credentials in `.env`. Do not leave sample strings or bracket characters as passwords. A separate bootstrap password is required, even though the email address is the login identifier. SMTP is optional and is **not** configured by default; external phishing awareness emails will not be sent until an authorized email provider is configured and tested.

## D. Start backend and frontend (native Windows)

Use two **separate** CMD windows, **not** Admin CMD:

**Terminal 1 (backend):**

```cmd
cd /d D:\SecurAware_Fresh\SecurAware_Complete\server
npm.cmd install
npm.cmd audit
npm.cmd start
```

Wait for `BOOTSTRAP ADMIN CREATED ...` and `SecurAware API on 4000`. On later starts, `BOOTSTRAP ADMIN CREATED` won't appear, because the account already exists.

**Terminal 2 (frontend):**

```cmd
cd /d D:\SecurAware_Fresh\SecurAware_Complete\client
npm.cmd install
npm.cmd audit
npm.cmd run dev
```

Visit `http://localhost:5173/`. The native Vite server is bound to `127.0.0.1` by default, rather than advertising your laptop's other network adapters. Keep both terminals running.

In another CMD run `curl.exe http://localhost:4000/api/health`. It should return `{"ok":true}`. This confirms HTTP reachability, **not** that every application function works.

**PowerShell users:** use `cd "D:\SecurAware_Fresh\SecurAware_Complete\client"` (no `/d`), and `npm.cmd`, not `npm`, if its script policy blocks npm.ps1.

## E. First-login tests

- Sign in with `BOOTSTRAP_EMAIL` and `BOOTSTRAP_PASSWORD` you set in the fresh `.env`.
- Change the temporary password; verify the eye button reveals/hides each relevant input.
- Enroll MFA by **scanning QR** with an authenticator app; confirm the six-digit TOTP. Never share screenshots containing the QR or secret.
- Review the real seeded AUP and acknowledge it. Confirm the Directing Manager dashboard loads.
- Sign out, sign back in, and verify MFA is required again.

## F. UI regression tests

1. Repeatedly switch between Overview, Courses, Policies, Campaigns, Password Tester, Notifications, Profile and Organization (at least 10 times). No blank page and no React cleanup warning should appear.
2. Refresh on `/#/policies` or `/#/campaigns`. The current section should be retained after authentication.
3. Click the new sidebar-collapse button in the top bar on **desktop**; check icons-only collapsed state and ability to expand. Close/reopen page and check remembered state. On narrow screens it remains the mobile sidebar toggle.
4. In Profile change `Display name`, refresh and ensure the greeting updates. The email stays as the unique **login identifier**.
5. In Courses → Create course, drag and drop a JPG/PNG/WEBP under 5 MB or select **Browse files**. Confirm local preview. Add a quiz question, save as draft, open it and check cover image visibility.
6. Add a course resource file using the new drop zone. Assign course to a separate authorized test user and verify they can view/download the file. Upload evidence using drag-and-drop and Browse.
7. Confirm uploaded files over the limit and disallowed extensions show clear errors. Server-side upload validation remains essential, especially before any public deployment.
8. Confirm Policies displays the seeded AUP, Notifications displays the empty state with no messages, and newly created/assigned activities produce expected notifications.
9. Inspect Chrome DevTools Console for **new** errors after clearing old log entries. Check Network failures if any page crashes; provide error text without credentials or TOTP secrets.

## Important limitations

- This source has been checked syntactically and with static tests, but **a full Windows + PostgreSQL + Chrome end-to-end test must be done on your laptop**. Do not describe the app as production-ready or submit it as fully validated without completing tests.
- The Password Tester page remains an explicit integration point for the team member's module.
- SMTP campaign delivery must be configured separately and tested with authorized recipient addresses and a reachable HTTPS origin; localhost email links will not work on other devices.
- Production deployment needs a separate security review, including upload content inspection, encryption of stored MFA secrets, stronger authorization checks, rate limits and robust SMTP delivery tracking.
- For a clean local test, continue to keep your previous database until the new source is confirmed working. Do **not** delete the old database as part of the procedure.
