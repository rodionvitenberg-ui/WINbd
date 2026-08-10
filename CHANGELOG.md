# WINbd — журнал изменений (CHANGELOG)

> Хронология всех изменений проекта. Самая свежая запись — сверху. Формат: `Дата — что сделано — (учебник/файлы)`.

Все даты — `YYYY-MM-DD`, время в `Asia/Bishkek (UTC+6)`.

---

## [0.x] — Фундамент (Фаза 0)

### 2026-08-11
- **Начало проекта.** Согласован план: MongoDB Atlas, формат работы «агент кодит + объясняет», русские комментарии, отдельный `.clinerules.md` в корне, история разработки по фазам в `docs/history/`.
- Создан `.clinerules.md` — единый источник правил для агентов (окружение, конвенции, режим обучения, домен).
- Создан `CLAUDE.md` — краткая сводка: стек, команды, домен, режим обучения.
- Создан `DESIGN.md` — дизайн-система (тёмная тема, палитра, типографика, компоненты, SCSS-структура).
- Создан `ROADMAP.md` — план из 10 фаз с привязкой учебников `docs/history/phase-XX.md`.
- Создан `PROGRESS.md` — журнал прогресса с колонкой «Понял ли?».
- Создан `CHANGELOG.md` — этот файл.

- Создан `README.md` — описание проекта и запуск.
- Создан `docs/history/phase-0-fundament.md` — учебник фазы 0 (концепции, альтернативы, git/npm, все команды).
- Создана структура папок `backend/` и `frontend/`, файл `backend/uploads/.gitkeep`.
- Создан `.gitignore` (node_modules, .env, uploads/, логи, .DS_Store и т.д.).
- `git init` → ветка переименована в `main` → первый коммит `b239fb0`.
- Через GitHub MCP создан удалённый репозиторий **`rodionvitenberg-ui/WINbd`** (https://github.com/rodionvitenberg-ui/WINbd), `git remote add origin`, первый `git push -u origin main`.
- **Фаза 0 завершена.** Файлы: `.clinerules.md`, `CLAUDE.md`, `DESIGN.md`, `ROADMAP.md`, `PROGRESS.md`, `CHANGELOG.md`, `README.md`, `.gitignore`, `docs/history/phase-0-fundament.md`.
- Обновлены `PROGRESS.md` (задачи 0.1–0.11 = ✅) и этот `CHANGELOG.md`.
- ❗ Актуальные использованные команды (журнал):
  - `git init` — репозиторий в `WINbd`
  - `git add .` — добавить все файлы в индекс
  - `git commit -m "Фаза 0: правила, манифесты, дизайн-система, README, структура проекта"` — первый коммит
  - `git branch -M main` — переименовать ветку
  - [GitHub MCP] `create_repository` → `rodionvitenberg-ui/WINbd`
  - `git remote add origin https://github.com/rodionvitenberg-ui/WINbd.git`
  - `git push -u origin main`

---

## [1.x] — Backend: каркас (Фаза 1)

### Планируется
- npm-инициализация backend, установка express/mongoose/dotenv/cors/nodemon.
- `.env` / `.env.example` (MONGO_URI, JWT_SECRET, PORT).
- `server.js`, `app.js`, `config/db.js`, `/api/health`, CORS.
- Учебник `docs/history/phase-1-backend-core.md`.

---

## [2.x] — Авторизация (Фаза 2) ⭐

### Планируется
- Модель `User`, регистрация/логин, JWT, middleware проверки токена.
- Учебник `docs/history/phase-2-auth.md`.

---

## [3.x] — News CRUD + отложенная публикация (Фаза 3) ⭐

### Планируется
- Модель `News`, CRUD endpoints, публикация сейчас / по дате.
- Учебник `docs/history/phase-3-news-crud.md`.

---

## [4.x] — Файлы и статика (Фаза 4)

### Планируется
- Multer, express.static, ограничения.
- Учебник `docs/history/phase-4-files.md`.

---

## [5.x] — Real-time (Фаза 5) ⭐

### Планируется
- Socket.io, эмиссия news:created/updated/deleted.
- Учебник `docs/history/phase-5-real-time.md`.

---

## [6.x] — Frontend: скелет (Фаза 6)

### Планируется
- Vite + React + SCSS, роутинг, AuthContext, axios-клиент с JWT.
- Учебник `docs/history/phase-6-frontend-core.md`.

---

## [7.x] — Блочный редактор (Фаза 7)

### Планируется
- Editor + Toolbar, блоки text/image/quote/code/file, предпросмотр.
- Учебник `docs/history/phase-7-editor.md`.

---

## [8.x] — Уведомления на клиенте (Фаза 8) ⭐

### Планируется
- socket.io-client, колокольчик Bell.jsx.
- Учебник `docs/history/phase-8-bell.md`.

---

## [9.x] — Полировка и публикация (Фаза 9)

### Планируется
- Адаптивность, деплой backend (Render/Railway/Fly.io) и frontend (Vercel).
- Учебник `docs/history/phase-9-polish.md`.