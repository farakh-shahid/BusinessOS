# BusinessOS — Tailor Shop

Web app for Pakistani tailor shops: **Next.js frontend** + **NestJS API**.

## Apps

| Folder | Purpose |
|--------|---------|
| `frontend` | Next.js UI |
| `backend` | NestJS API |

## Database (PostgreSQL)

Two PostgreSQL **schemas** in one database:

| Schema | Purpose | Tables |
|--------|---------|--------|
| **`business_os`** | Shared platform | `tenants`, `users` |
| **`business_os_tailor`** | Tailor module | `customers`, `measurements`, `orders` |

Every tailor table has **`tenant_id`**. Orders also store **`created_by_user_id`**.

### Roles (`users.role`)

| Role | Description |
|------|-------------|
| `SUPER_ADMIN` | BusinessOS platform admin (`tenant_id` is null) |
| `ADMIN` | Tailor shop owner |
| `STAFF` | Shop worker (orders, no settings) |
| `TAILOR` | Assigned orders only |

`users.permissions` is JSON (`{}` by default) for future RBAC.

### Docker + migrate

```bash
# Start PostgreSQL (placeholder user/pass — change when ready)
npm run db:up

# Copy env and run migrations + seed
cp backend/.env.example backend/.env
npm install
npm run db:migrate    # name: init
npm run db:seed

# Remote / Vercel (Neon) — migrations + demo seed in one step:
# DATABASE_URL="postgresql://..." npm run db:deploy:seed
```

Seed creates:
- Super admin: `superadmin@businessos.pk`
- Demo tenant: **Demo Tailor Shop**
- Shop admin: `admin@demotailor.pk`
- 6 staff tailors, 10 customers, 18 sample orders (with assignments, rush, receivables)
- Password: `changeme123`

```bash
npm run db:studio   # Prisma Studio GUI
npm run db:down     # Stop database
```

## Quick start (app)

```bash
npm install
npm run dev:frontend   # http://localhost:3000
npm run dev:backend    # http://localhost:3001
```

## Folder structure

```
business-os/
├── frontend/          # Next.js app
│   └── src/
│       ├── app/           # routes (dashboard, orders, …)
│       ├── core/          # auth, UI kit, API client
│       ├── features/      # product UI, hooks, API layer
│       └── i18n/          # en / ur translations
├── backend/           # NestJS API
│   ├── prisma/
│   └── src/
│       ├── core/      # auth, database, notifications
│       └── modules/   # orders, customers, staff…
├── shared/            # shared types, phone utils, document helpers (FE + BE)
└── docker-compose.yml
```

Both apps import shared code via the `@shared` TypeScript path alias. The backend compiles `shared/` to `shared/dist/` on build; the frontend bundles shared source directly.

Authenticated app routes live at `/dashboard`, `/orders`, etc. (no `/tailor` prefix). Old `/tailor/*` URLs redirect permanently to the new paths.
