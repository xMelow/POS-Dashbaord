# POS / EagleBe Gemeenten Dashboard

Standalone internal dashboard showing, per Belgian gemeente, whether it is a
Park-O-Sign (POS) klant, has EagleBe actief, and where it sits in the sales
pipeline — rendered as a colored map of Belgium. Municipalities can be edited
in place; changes are written straight to the database.

## Preview

![preview image of the dashboard](dashboardPreview.png)

## Stack

| Part      | Tech                                                                    |
|-----------|-----------------------------------------------------------------------  |
| Frontend  | React 19 + TypeScript, Vite, Tailwind CSS v4, `react19-simple-maps`     |
| Backend   | ASP.NET Core (.NET 10) Web API, EF Core + SQLite                        |
| Import    | Python (`pandas` + `openpyxl`) one-shot Excel → SQLite loader          |

## Repository layout

```
backend/PosDashbaord.Api/   ASP.NET Core API (controllers, EF Core model, SQLite)
frontend/                   Vite React app (map, search, edit panel)
scripts/import_excel.py     Excel → SQLite reseed script
frontend/src/data/belgium.json   TopoJSON of Belgian municipalities (map + NIS lookup)
```

## Running locally

### 1. Backend

```bash
cd backend/PosDashbaord.Api
dotnet run
```

Serves on `http://localhost:5093`. `EnsureCreated()` creates
`data/dashboard.db` on first run if it does not exist. CORS is open to the Vite
dev server at `http://localhost:5173`.

### 2. Seed the database

The map is empty until the Excel export is imported:

```bash
pip install pandas openpyxl
python scripts/import_excel.py \
  path/to/Belgische_gemeenten_dashboard_POS_EagleBe.xlsx \
  backend/PosDashbaord.Api/data/dashboard.db \
  frontend/src/data/belgium.json
```

This **drops and recreates** the `Municipalities` table every run and reloads
it from the Excel file — it is a reseed, not a merge. While the Excel is the
source of truth, any `Status` / `Setup` edits made through the app are
overwritten on re-run. It also matches each gemeente to its RefnisCode (NIS
code) against `belgium.json`; unmatched names are reported at the end and can be
fixed via `MANUAL_ALIASES` in the script.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Opens on `http://localhost:5173`. The API base URL is hardcoded in
`frontend/src/api/client.ts`.

## API

Base: `http://localhost:5093/api`

| Method | Route                     | Body                          | Description                          |
|--------|---------------------------|-------------------------------|--------------------------------------|
| GET    | `/municipalities`         | —                             | All municipalities                   |
| POST   | `/municipalities/{id}`    | `{ setup, status }`           | Update one; returns the updated row  |

`setup` is one of `Geen` / `Park-O-Sign` / `EagleBe`. The controller derives
`isPosCustomer` / `isEagleBeActive` from it and stamps `lastUpdated` (UTC).
`status` is the pipeline state: `""`, `Prospectie`, `Afgekeurd`, `Uitgesteld`,
`Lopend`, `Order`.

## Data model

`Municipality`: `id`, `name`, `refnisCode`, `region`, `province`,
`postalCodes` (`int[]`, stored as JSON via an EF value converter), `setup`,
`status`, `isPosCustomer`, `isEagleBeActive`, `lastUpdated`.

## Frontend behaviour

- **Map** — each gemeente is filled by status color when it has a pipeline
  status, otherwise by product (EagleBe / Park-O-Sign / Geen). Header legend
  shows live counts. Click a gemeente to select it; click empty space to
  deselect.
- **Search** — type-ahead by name (top 8 matches), Dutch/French names.
- **Gemeente panel** — edit `Setup` and `Status`; **Opslaan** POSTs the change,
  which updates the map and the database.
