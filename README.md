# OmniMetrics Dashboard

A business intelligence dashboard for tracking core KPIs, analyzing timeseries revenue, ingesting CSV/SQL data sources, and generating printable board reports.

## Tech Stack
- Frontend: React 18, Vite, Tailwind CSS, Chart.js
- Backend: Node.js, Express, PostgreSQL (node-postgres pool)
- Deployment: Docker Compose, Nginx, GitHub Actions

## Getting Started
```bash
cp .env.example .env
docker-compose up --build
```
Access the client at `http://localhost:3000` and the API at `http://localhost:5000`.

## Local Development
Run without Docker:
```bash
cd backend && npm install && npm run dev
cd ../frontend && npm install && npm run dev
```
