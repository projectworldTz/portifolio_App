# Deployment

## Truehost / shared-hosting deployment

The repository includes a root-level `deploy.sh` configured for this Truehost
layout, where `public_html` points to
`/home/projectw/repositories/portfolio-app/backend/public`. The React build is
therefore published into `backend/public` alongside Laravel's `index.php`.

One-time setup on the server:

```bash
cd /home/projectw/repositories/portfolio-app
chmod +x deploy.sh
```

Deploy future updates with:

```bash
./deploy.sh
```

The command pulls `origin/main`, installs locked Composer and npm dependencies,
builds the React app with `/api` as its API path, copies the build into `backend/public/`,
runs Laravel migrations, refreshes Laravel's caches, and brings the application
back online even when a later step fails. It does not replace `backend/.env`,
uploaded files, or Laravel's existing `backend/public/.htaccess`.

Truehost-specific modifications to `backend/public/.htaccess` and
`backend/public/robots.txt` are allowed by the safety check. Other tracked
server-side edits stop deployment so they cannot be overwritten accidentally.
Untracked hosting files and directories are left untouched.

Configuration can be supplied without editing the script:

```bash
DEPLOY_BRANCH=develop ./deploy.sh
PUBLIC_DIR=dist ./deploy.sh
PHP_BIN=/usr/local/bin/php82 ./deploy.sh
```

The server must provide Git, PHP 8.2+, Composer, and Node/npm. The first run
will fail with a specific message if any requirement or `backend/.env` is
missing. Never commit the production `.env` file.

The frontend build tools are pinned to releases compatible with Truehost's
Node.js 20.17 and the deployment explicitly installs development dependencies
because TypeScript and Vite are needed during the build.

## Render deployment

This app deploys as a **single Render Web Service**: a Docker image that builds
the React frontend and Laravel backend together, so Laravel serves both the
API (`/api/*`) and the built SPA (everything else) from one domain. That
avoids the cross-domain cookie problem entirely — no CORS, no shared-subdomain
issues, just one URL.

## 1. Generate a real `APP_KEY` locally

Render's auto-generated secrets aren't in the exact `base64:...` format Laravel
requires, so generate one yourself and paste it in manually:

```
cd backend
php artisan key:generate --show
```

Copy the `base64:...` output — you'll paste it into Render's dashboard in step 3.

## 2. Create the database

In the Render dashboard: **New → PostgreSQL**.

- Name: `portfolio-db` (or anything — just remember it)
- Plan: Free is fine to start
- Note the **Internal Database URL** / connection details once it's provisioned — you'll need the host, port, database name, username, and password.

> We're using Postgres, not MySQL, because Render's managed database offering
> is Postgres-native. Our migrations use Laravel's schema builder throughout
> (no raw MySQL SQL), so this required no code changes — `config/database.php`
> already ships a working `pgsql` connection.

## 3. Create the web service

**New → Web Service** → connect your GitHub repo (`jamanila/portifolio_App`).

- **Environment**: Docker
- **Dockerfile Path**: `Dockerfile` (repo root — it builds both `frontend/` and `backend/`)
- **Docker Build Context Directory**: `.` (repo root)
- **Plan**: Free is fine to start
- **Health Check Path**: `/up`

Pick a service name now (e.g. `portfolio-app`) — its URL will be
`https://portfolio-app.onrender.com`, and you'll need that exact URL for the
env vars below.

### Environment variables

Set these in the service's **Environment** tab:

| Key | Value |
|---|---|
| `APP_NAME` | `Portfolio App` |
| `APP_ENV` | `production` |
| `APP_DEBUG` | `false` |
| `APP_KEY` | the `base64:...` value from step 1 |
| `APP_URL` | `https://portfolio-app.onrender.com` (your actual service URL) |
| `FRONTEND_URL` | same as `APP_URL` |
| `SANCTUM_STATEFUL_DOMAINS` | `portfolio-app.onrender.com` (hostname only, no `https://`) |
| `SESSION_DOMAIN` | leave blank/unset — Laravel defaults to the current host, which is correct here |
| `SESSION_DRIVER` | `database` |
| `CACHE_STORE` | `database` |
| `QUEUE_CONNECTION` | `database` |
| `FILESYSTEM_DISK` | `public` |
| `DB_CONNECTION` | `pgsql` |
| `DB_HOST` | from your Render Postgres instance |
| `DB_PORT` | `5432` |
| `DB_DATABASE` | from your Render Postgres instance |
| `DB_USERNAME` | from your Render Postgres instance |
| `DB_PASSWORD` | from your Render Postgres instance |
| `ADMIN_NAME` | your name |
| `ADMIN_EMAIL` | the email you'll log into `/admin` with |
| `ADMIN_PASSWORD` | a real password — this seeds your admin account on first deploy |
| `MAIL_MAILER` | `log` (until you configure real SMTP) |

Alternatively, there's a `render.yaml` at the repo root — try **New → Blueprint**
and point it at the repo first; it pre-wires most of this (including linking
the database automatically). If Render's Blueprint schema has changed since
this was written and it errors, fall back to the manual steps above.

## 4. Deploy

Render will build the Docker image (this takes a few minutes the first time —
it's compiling the frontend and installing Composer dependencies) and start
the container. The entrypoint script automatically:

- Runs `php artisan migrate --force`
- Seeds your admin account (`ADMIN_EMAIL`/`ADMIN_PASSWORD`)
- Creates the `storage:link` symlink
- Caches config/routes/views for production performance

Once it's live, visit your Render URL — you should see the portfolio site,
and `/admin/login` should let you sign in with the `ADMIN_EMAIL`/`ADMIN_PASSWORD`
you set.

## Important: uploaded files don't persist by default

Render's free web services have an **ephemeral filesystem** — anything written
to `storage/app/public` (project thumbnails, your profile photo, etc.) is
**lost on every redeploy or restart**. Options, roughly in order of effort:

1. **Do nothing for now** — fine while you're actively testing, just know
   you'll need to re-upload images after each deploy.
2. **Attach a Render Disk** (paid feature) mounted at
   `/var/www/html/storage/app/public` — makes uploads persistent across
   deploys on that one service.
3. **Use cloud object storage** (S3, Cloudflare R2, etc.) instead of local
   disk for uploads — the most robust long-term option, but requires wiring
   Laravel's `filesystems.php` to an S3-compatible driver and adding
   provider credentials. Ask if you want this built out.

## Redeploying after future code changes

Push to `main` on GitHub — Render's default is to auto-deploy on push. Each
deploy rebuilds the Docker image from scratch and re-runs migrations, so
schema changes ship automatically.
