# BusinessOS

Multi-module SaaS for Pakistani small businesses. **Tailor module** is active first.

## Apps

| Folder | Purpose |
|--------|---------|
| `apps/businessos-frontend` | Next.js UI |
| `apps/businessos-backend` | NestJS API |

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
| `STAFF` | Shop worker |

`users.permissions` is JSON (`{}` by default) for future RBAC.

### Docker + migrate

```bash
# Start PostgreSQL (placeholder user/pass — change when ready)
npm run db:up

# Copy env and run migrations + seed
cp apps/businessos-backend/.env.example apps/businessos-backend/.env
npm install
npm run db:migrate    # name: init
npm run db:seed
```

Seed creates:
- Super admin: `superadmin@businessos.pk`
- Demo tenant: **Demo Tailor Shop**
- Shop admin: `admin@demotailor.pk`
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
├── apps/
│   ├── businessos-frontend/src/
│   │   ├── app/
│   │   ├── core/
│   │   └── tailor/
│   └── businessos-backend/
│       ├── prisma/schema.prisma
│       └── src/
│           ├── core/
│           └── tailor/
├── packages/
│   ├── shared/
│   ├── i18n/
│   └── tailor/
└── docker-compose.yml
```
