#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
API_PORT="${API_PORT:-8080}"
API_BASE_URL="${API_BASE_URL:-http://127.0.0.1:${API_PORT}}"
MYSQL_DSN="${MYSQL_DSN:-root:root@tcp(127.0.0.1:3306)/nlp?parseTime=true&multiStatements=true}"

cd "$ROOT_DIR"

echo "[smoke] Ensuring mysql container is running"
docker compose up -d >/dev/null

for i in {1..40}; do
  health="$(docker inspect --format='{{.State.Health.Status}}' nlp-mysql 2>/dev/null || echo unknown)"
  if [[ "$health" == "healthy" ]]; then
    echo "[smoke] mysql is healthy"
    break
  fi
  if [[ "$i" -eq 40 ]]; then
    echo "[smoke] mysql did not become healthy in time"
    exit 1
  fi
  sleep 2
done

echo "[smoke] Applying migrations"
docker exec -i nlp-mysql mysql -uroot -proot -e "DROP DATABASE IF EXISTS nlp; CREATE DATABASE nlp;" >/dev/null
for f in db/migrations/*.up.sql; do
  docker exec -i nlp-mysql mysql -uroot -proot nlp < "$f" >/dev/null
done

echo "[smoke] Starting API server in mysql mode"
AUTH_ENABLED=false MYSQL_DSN="$MYSQL_DSN" go run ./cmd/server > /tmp/nlp-api-smoke.log 2>&1 &
API_PID=$!
cleanup() {
  if kill -0 "$API_PID" >/dev/null 2>&1; then
    kill "$API_PID" >/dev/null 2>&1 || true
    wait "$API_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT

for i in {1..40}; do
  if node -e "fetch('${API_BASE_URL}/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))" >/dev/null 2>&1; then
    break
  fi
  if [[ "$i" -eq 40 ]]; then
    echo "[smoke] api did not become ready in time"
    cat /tmp/nlp-api-smoke.log || true
    exit 1
  fi
  sleep 1
done

echo "[smoke] Calling healthz, progress sync and quiz submit"
node -e "(async()=>{const h=await fetch('${API_BASE_URL}/healthz');const hjson=await h.json();if(hjson.storageMode!=='mysql'){throw new Error('expected storageMode=mysql, got '+hjson.storageMode)};const p=await fetch('${API_BASE_URL}/api/v1/progress/sync',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({mergeToken:'smoke-'+Date.now(),subject:'network',items:[{nodeId:'network/system/tcp',completed:true,updatedAt:new Date().toISOString()}]})});if(!p.ok){throw new Error('progress sync failed')};const q=await fetch('${API_BASE_URL}/api/v1/quizzes/submit',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({quizId:'tcp-handshake-01',subject:'network',answers:[{questionId:'q1',selected:['A']}]})});if(!q.ok){throw new Error('quiz submit failed')};console.log('[smoke] api calls ok');})().catch(e=>{console.error(e);process.exit(1)})"

echo "[smoke] Verifying db rows"
DB_COUNTS="$(docker exec -i nlp-mysql mysql -N -uroot -proot -D nlp -e "SELECT COUNT(*) FROM user_progress; SELECT COUNT(*) FROM user_quiz_attempts; SELECT COUNT(*) FROM user_wrong_questions;")"
progress_count="$(echo "$DB_COUNTS" | sed -n '1p')"
attempt_count="$(echo "$DB_COUNTS" | sed -n '2p')"
wrong_count="$(echo "$DB_COUNTS" | sed -n '3p')"

if [[ "$progress_count" -lt 1 || "$attempt_count" -lt 1 || "$wrong_count" -lt 1 ]]; then
  echo "[smoke] expected persisted rows >= 1 but got progress=$progress_count attempt=$attempt_count wrong=$wrong_count"
  exit 1
fi

echo "[smoke] success: progress=$progress_count attempt=$attempt_count wrong=$wrong_count"
