#!/usr/bin/env bash

set -Eeuo pipefail

# Override when needed, for example:
#   DEPLOY_BRANCH=develop PUBLIC_DIR=dist ./deploy.sh
DEPLOY_BRANCH="${DEPLOY_BRANCH:-main}"
PUBLIC_DIR="${PUBLIC_DIR:-backend/public}"
PHP_BIN="${PHP_BIN:-php}"
COMPOSER_BIN="${COMPOSER_BIN:-composer}"
NPM_BIN="${NPM_BIN:-npm}"

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="${ROOT_DIR}/backend"
FRONTEND_DIR="${ROOT_DIR}/frontend"

if [[ "${PUBLIC_DIR}" != /* ]]; then
    PUBLIC_DIR="${ROOT_DIR}/${PUBLIC_DIR}"
fi

LOCK_DIR="${ROOT_DIR}/.deploy.lock"
APP_WAS_STOPPED=0

log() {
    printf '\n\033[1;36m==> %s\033[0m\n' "$1"
}

fail() {
    printf '\n\033[1;31mDeployment failed:\033[0m %s\n' "$1" >&2
    exit 1
}

cleanup() {
    status=$?
    if [[ "${APP_WAS_STOPPED}" -eq 1 ]]; then
        (cd "${BACKEND_DIR}" && "${PHP_BIN}" artisan up) >/dev/null 2>&1 || true
    fi
    rmdir "${LOCK_DIR}" >/dev/null 2>&1 || true
    if [[ "${status}" -ne 0 ]]; then
        printf '\n\033[1;31mDeployment stopped. The previous frontend files were left in place.\033[0m\n' >&2
    fi
    exit "${status}"
}

trap cleanup EXIT
trap 'exit 130' INT TERM

[[ -d "${ROOT_DIR}/.git" ]] || fail "${ROOT_DIR} is not a Git checkout. Clone the repository here first."
[[ -f "${BACKEND_DIR}/.env" ]] || fail "Missing backend/.env. Create the production environment file before deploying."

for command_name in git "${PHP_BIN}" "${COMPOSER_BIN}" "${NPM_BIN}"; do
    command -v "${command_name}" >/dev/null 2>&1 || fail "Required command not found: ${command_name}"
done

if ! mkdir "${LOCK_DIR}" 2>/dev/null; then
    fail "Another deployment appears to be running. Remove .deploy.lock only if no deployment is active."
fi

cd "${ROOT_DIR}"

# Truehost maintains web-server directives in these two tracked public files.
# Allow them to remain locally customized, while refusing to deploy over any
# unexpected source-code edits made directly on the server.
UNEXPECTED_CHANGES="$(
    git status --porcelain --untracked-files=no |
        awk '$2 != "backend/public/.htaccess" && $2 != "backend/public/robots.txt" { print }'
)"

if [[ -n "${UNEXPECTED_CHANGES}" ]]; then
    printf '%s\n' "${UNEXPECTED_CHANGES}" >&2
    fail "Unexpected tracked server files contain local changes. Commit or restore them before deploying."
fi

log "Fetching ${DEPLOY_BRANCH} from origin"
git fetch origin "${DEPLOY_BRANCH}"
git checkout "${DEPLOY_BRANCH}"
git pull --ff-only origin "${DEPLOY_BRANCH}"

[[ -d "${FRONTEND_DIR}" ]] || fail "frontend/ is missing after the pull. Confirm that the server cloned the complete repository."

log "Installing production PHP dependencies"
cd "${BACKEND_DIR}"
"${COMPOSER_BIN}" install --no-dev --prefer-dist --optimize-autoloader --no-interaction --no-progress

log "Installing and building the React frontend"
cd "${FRONTEND_DIR}"
"${NPM_BIN}" ci --no-audit --no-fund
VITE_API_URL="${VITE_API_URL:-/api}" VITE_APP_URL="${VITE_APP_URL:-}" "${NPM_BIN}" run build

[[ -f "${FRONTEND_DIR}/dist/index.html" ]] || fail "The frontend build did not create frontend/dist/index.html."

log "Putting Laravel into maintenance mode"
cd "${BACKEND_DIR}"
"${PHP_BIN}" artisan down --retry=30 || true
APP_WAS_STOPPED=1

log "Running database migrations"
"${PHP_BIN}" artisan migrate --force

log "Publishing frontend files to ${PUBLIC_DIR}"
mkdir -p "${PUBLIC_DIR}"
cp -R "${FRONTEND_DIR}/dist/." "${PUBLIC_DIR}/"

log "Preparing Laravel storage and caches"
"${PHP_BIN}" artisan storage:link --force
"${PHP_BIN}" artisan optimize:clear
"${PHP_BIN}" artisan config:cache
"${PHP_BIN}" artisan route:cache
"${PHP_BIN}" artisan view:cache

"${PHP_BIN}" artisan up
APP_WAS_STOPPED=0

log "Deployment complete"
printf 'Branch: %s\nCommit: %s\nFrontend: %s\n' "${DEPLOY_BRANCH}" "$(git rev-parse --short HEAD)" "${PUBLIC_DIR}"
