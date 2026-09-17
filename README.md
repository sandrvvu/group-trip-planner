# group-trip-planner

Монорепо на pnpm workspaces: **Next.js** (web) + **NestJS** (api) + **PostgreSQL** у Docker.

## Що потрібно локально

| Інструмент     | Версія                  | Примітка                                                |
| -------------- | ----------------------- | ------------------------------------------------------- |
| Node.js        | 24.16.0 (див. `.nvmrc`) | `nvm use`                                               |
| pnpm           | 11.23.0                 | зафіксовано в `packageManager`                          |
| Docker Desktop | 4.90+                   | Compose вже входить у комплект, окремо ставити не треба |
| Git            | будь-яка сучасна        |                                                         |

**PostgreSQL локально ставити не треба** — він піднімається тільки як контейнер.
Якщо хочеться `psql` на хості: `brew install libpq`.

## Швидкий старт

```bash
nvm use
cp .env.example .env
cp apps/api/.env.example apps/api/.env
pnpm install
pnpm db:up
```

У `apps/api/.env` заповни `JWT_SECRET` і `JWT_REFRESH_SECRET` двома різними значеннями
(мінімум 32 символи). Без них API не стартує. Згенерувати:

```bash
openssl rand -base64 48
```

Далі:

```bash
pnpm db:migrate
pnpm dev
```

web буде на :3000, api на :3001. Перевірка:

```bash
curl localhost:3001/health
```

Очікувана відповідь: `{"status":"ok","db":"up"}`.

## Структура

```
apps/web         Next.js 16 + Tailwind v4 + shadcn/ui
apps/api         NestJS 12 + TypeORM + pg
packages/shared  @repo/shared — спільні типи, збирається в dist через tsc
```

Спільна конфігурація живе в корені: `tsconfig.base.json`, `eslint.config.mjs`,
`.prettierrc`. Версії, що мусять збігатися (TypeScript, ESLint, `@types/node`),
пінуються один раз у `pnpm-workspace.yaml` через `catalog:`.

## API

### Змінні оточення (`apps/api/.env`)

| Ключ                 | Опис                                                           |
| -------------------- | -------------------------------------------------------------- |
| `NODE_ENV`           | `development` або `production`, за замовчуванням `development` |
| `PORT`               | порт API, за замовчуванням 3001                                |
| `DATABASE_URL`       | `postgres://…` або `postgresql://…`                            |
| `JWT_SECRET`         | мінімум 32 символи                                             |
| `JWT_REFRESH_SECRET` | мінімум 32 символи, має відрізнятися від `JWT_SECRET`          |
| `JWT_ACCESS_TTL`     | термін дії access-токена в секундах, за замовчуванням 900      |
| `JWT_REFRESH_TTL`    | термін дії refresh-токена в секундах, за замовчуванням 604800  |
| `CORS_ORIGIN`        | один або кілька origin через кому                              |

Схема валідації: `apps/api/src/config/env.schema.ts` (Zod). При невалідному значенні API падає
на старті з назвою поля.

### Міграції

`synchronize` вимкнено, схема БД змінюється тільки міграціями. Команди запускати з `apps/api`
або через `pnpm --filter api`:

```bash
pnpm --filter api migration:generate src/database/migrations/НазваМіграції
pnpm --filter api migration:run
pnpm --filter api migration:revert
```

`migration:generate` порівнює entity з поточною схемою БД. Без змін він завершується помилкою
«No changes in database schema». Кожна команда спочатку виконує `nest build`, бо CLI працює
з `dist`.

### Auth

| Метод  | Шлях             | Що робить                                      |
| ------ | ---------------- | ---------------------------------------------- |
| `POST` | `/auth/register` | `{ email, name, password }` → 201              |
| `POST` | `/auth/login`    | `{ email, password }` → 200                    |
| `POST` | `/auth/refresh`  | бере refresh-токен з cookie → 200              |
| `GET`  | `/users/me`      | потрібен `Authorization: Bearer <accessToken>` |

- Усі три `/auth/*` повертають `{ user, accessToken }` (тип `AuthResponse` в `@repo/shared`) і ставлять
  cookie `refresh_token`: `HttpOnly`, `SameSite=Strict`, `Path=/auth`, `Secure` лише при `NODE_ENV=production`.
- На фронті запити до `/auth/*` робити з `credentials: 'include'`, інакше браузер не надішле й не збереже cookie.
- Access-токен зберігати в пам'яті застосунку, а не в `localStorage`.
- Refresh-токен одноразовий: кожен `/auth/refresh` видає новий. Повторне використання старого відкликає сесію.
  Тому на фронті одночасно має виконуватися лише один refresh-запит.
- Одна активна сесія на користувача: новий логін робить попередній refresh-токен недійсним.
- `SameSite=Strict` працює, поки web і api на одному сайті (напр. `localhost` на різних портах або
  `app.example.com` і `api.example.com`).
- Пароль: від 8 символів і не більше 72 байт (обмеження bcrypt).

### Помилки

Усі помилки API мають однаковий формат (тип `ApiError` в `@repo/shared`):

```json
{ "statusCode": 400, "message": ["name must be a string"], "error": "Bad Request" }
```

Для неочікуваних помилок клієнт отримує `500` і `"Internal server error"`, деталі пишуться в лог.

## Скрипти

| Команда                                        | Що робить                                           |
| ---------------------------------------------- | --------------------------------------------------- |
| `pnpm dev`                                     | web + api + watch-збірка shared                     |
| `pnpm build`                                   | turbo збирає shared → api/web у правильному порядку |
| `pnpm typecheck` / `pnpm lint`                 | по всіх пакетах                                     |
| `pnpm db:up` / `db:down` / `db:reset`          | Postgres (`reset` стирає том)                       |
| `pnpm db:migrate`                              | застосувати міграції                                |
| `docker compose --profile tools up -d pgadmin` | pgAdmin на :5050 (опційно)                          |

## Рішення, які варто знати

- **TypeScript запінено на 6.0.3.** `@nestjs/schematics@12` вимагає peer
  `typescript >=6.0.0`, а `typescript-eslint@8` — `<6.1.0`. Вікно вузьке;
  TS 7.x (нативний Go-порт) поки не проходить.
- **ESLint 9.x, не 10.** Плагіни всередині `eslint-config-next@16` підтримують
  максимум ESLint 9 — на 10 `eslint-plugin-react` падає.
- **`postgres:17-alpine`, не 18.** В образі PG 18 змінився дефолтний `PGDATA`,
  через що звичайний маунт на `/var/lib/postgresql/data` мовчки не персистить дані.
- **Міграції запускаються з `dist`, без ts-node.** API — ESM-пакет, і TypeORM CLI
  завантажує зібрані `.js` через `import()`.
