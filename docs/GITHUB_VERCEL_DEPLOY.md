# Deploy SecurAware from GitHub

This source has a Vite frontend and an Express/PostgreSQL backend. For a working
demo, deploy the API and PostgreSQL on Railway, attach a persistent volume for
uploads, and publish the frontend on Vercel. Vercel routes `/api/*` to Railway
on the same public origin as the frontend. This is a test deployment, not a
production security certification. Use only test accounts and test files.

## 1. Push a private GitHub repository

Use the **empty private** repository `deshith123456/secureware`. Do not add the
ZIP itself. From the
extracted `SecurAware_Complete` folder, run:

```powershell
git init -b main
git add .
git commit -m "Prepare SecurAware deployment"
git remote add origin https://github.com/deshith123456/secureware.git
git push -u origin main
```

Sign in using Git Credential Manager when prompted. Never put a GitHub token,
database password, `.env`, or MFA QR code in the repository. The repository's
`.gitignore` excludes local secrets, dependencies, build output, and uploads.

## 2. Deploy the API and database on Railway

1. Create a Railway project and add a PostgreSQL service.
2. Add a new service from the GitHub repository. Leave its **root directory at
   the repository root**. In Build settings, set the Dockerfile path to
   `Dockerfile.railway` if Railway does not find it automatically.
3. Attach a persistent volume to the API service mounted at `/app/uploads`.
   Do this **before** using any upload feature.
4. Set API service variables:

   | Variable | Value |
   | --- | --- |
   | `DATABASE_URL` | Reference Railway PostgreSQL's `DATABASE_URL` variable. |
   | `NODE_ENV` | `production` |
   | `BOOTSTRAP_EMAIL` | Your private test-account email. |
   | `BOOTSTRAP_NAME` | Your test-account display name. |
   | `BOOTSTRAP_PASSWORD` | A unique random value of at least 16 characters. |
   | `APP_ORIGIN` | The final Vercel HTTPS URL, once assigned. |

   Leave SMTP unset for now. Keep every secret in Railway variables, not GitHub.
   Do not use the local `.env.example` placeholder values.
5. Generate an HTTPS domain for the API. Open `https://YOUR-API-DOMAIN/api/health`;
   it should return `{"ok":true}`. Check deployment logs for the bootstrap
   account creation and database initialization. Do not share the password.

## 3. Publish the frontend on Vercel

1. In Vercel, import `deshith123456/secureware` from GitHub.
2. Set **Root Directory** to `client`. Framework should be **Vite**;
   Build Command `npm run build`; Output Directory `dist`.
3. Add an environment variable named `API_ORIGIN` with the Railway API HTTPS
   origin only, for example `https://YOUR-API-DOMAIN` (no trailing path).
4. Deploy and copy the assigned production URL. Set Railway's `APP_ORIGIN` to
   that exact origin, for example `https://YOUR-SITE.vercel.app` (no slash or
   path). Redeploy the API if its settings require it.
5. Open the Vercel URL and test sign-in, first password change, MFA setup,
   AUP acknowledgment, and a small test upload/download. Check that the
   Vercel `/api/health` path returns `{"ok":true}` and that `/api/me` responds
   through the proxy. Use a real authenticator app, but never share its QR
   code or recovery data.

If you later assign a custom domain, update Railway `APP_ORIGIN` to the exact
new origin. Vercel previews use distinct origins; this configuration targets
the production URL only.

## Limits and cautions

- This prototype has documented security gaps in the main README. Restrict
  access to trusted testers and use synthetic data until those are reviewed.
- Railway's PostgreSQL and volume are separate persistent services and may
  incur charges. Check the plan before creating or upgrading them.
- Railway's Free/Trial/Hobby outbound SMTP restrictions mean the optional
  phishing-email feature should remain disabled in this demo.
- Back up the database and upload volume before resetting services.
- A successful health check only confirms routing, not the full application.
