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

### 2026-08-11
- `cd backend && npm init -y` — создан `package.json` (затем переписан под `winbd-backend`, скрипты `dev`/`start`).
- `cd backend && npm install express mongoose dotenv cors` — production-зависимости.
- `cd backend && npm install --save-dev nodemon` — dev-зависимость (автоперезапуск при изменениях).
- Создан `backend/.env.example` (шаблон: PORT, MONGO_URI, JWT_SECRET, JWT_EXPIRES_IN, CORS_ORIGIN) → `backend/.env` (`cp .env.example .env`; секрет в git не попадает — `.gitignore`).
- Созданы `backend/src/config/db.js` (подключение MongoDB через Mongoose), `backend/src/app.js` (createApp: middleware CORS/JSON/urlencoded, `/api/health`, 404), `backend/src/server.js` (dotenv → createApp → connectDB → listen).
- **Проверка:** приложение поднято на случайном порту, `GET /api/health` → HTTP 200, `{"status":"ok","uptime":...,"timestamp":...}`, CORS заголовок `*` (в тесте без dotenv сработал fallback; в проде — `http://localhost:5173` из `.env`).
- Создан учебник `docs/history/phase-1-backend-core.md` (middleware, CORS, dotenv, Mongoose, команды, вопросы).
- Обновлены `PROGRESS.md` (1.1–1.4 = ✅) и этот `CHANGELOG.md`.
- ❗ Команды фазы 1 (журнал): `npm init -y`; `npm install express mongoose dotenv cors`; `npm install --save-dev nodemon`; `cp .env.example .env`; проверка через `node -e "..."` с `app.listen(0)` + `fetch`.
- **Фаза 1 завершена.** Следующее: вставить реальный `MONGO_URI` из Atlas в `backend/.env` и запустить `npm run dev` (проверить «MongoDB подключена»).

---

## [2.x] — Авторизация (Фаза 2) ⭐

### 2026-08-11
- `cd backend && npm install jsonwebtoken bcrypt` — пакеты для JWT и хеширования.
- Создана модель `backend/src/models/User.js` (email с unique/lowercase/trim, `passwordHash` с `select: false`, timestamps, метод `comparePassword`).
- Создан `backend/src/middleware/auth.middleware.js` — проверка JWT: заголовок `Authorization: Bearer <token>`, `jwt.verify`, `req.user = payload`, 401 при ошибках.
- Создан `backend/src/controllers/auth.controller.js` — `register` (валидация, `bcrypt.hash`, `User.create`, выдача токена), `login` (`User.findOne().select('+passwordHash')`, `comparePassword`, универсальная ошибка 401), `getMe` (по `req.user.userId`).
- Создан `backend/src/routes/auth.routes.js` — POST /register, POST /login, GET /me (защищён middleware); подключён в `app.js` как `app.use('/api/auth', authRoutes)`.
- ⚠️ Инцидент: файл роутера создался с именем `auth.r` (усечение). Исправлено: создан корректный `auth.routes.js`, ошибочный `auth.r` удалён.
- **Проверка endpoints (без БД):** register без тела → 400; login без тела → 400; me без токена → 401; health → 200.
- Скилл `domain-modeling`: создан глоссарий `CONTEXT.md` (User, News, Block, Draft, Published, Scheduled publication, JWT, Authorship) и первый ADR `docs/adr/0001-scheduled-publication-as-data.md` («отложенная публикация — данные, а не таймер»).
- Создан учебник `docs/history/phase-2-auth.md` (bcrypt/соль, JWT-устройство, middleware-«охранник», select:false, универсальная ошибка, вопросы).
- Обновлены `PROGRESS.md` (2.1–2.4 = ✅) и этот `CHANGELOG.md`.
- ❗ Команды фазы 2 (журнал): `npm install jsonwebtoken bcrypt`; проверка через `node -e` + `fetch` (400/401/200).
- **Фаза 2 завершена.** Полный цикл регистрации/логина заработает после вставки реального `MONGO_URI` из Atlas в `backend/.env`.

---

## [3.x] — News CRUD + отложенная публикация (Фаза 3) ⭐

### 2026-08-11
- Создана модель `backend/src/models/News.js` — `title`, `blocks[]` (blockSchema со `strict: false`), `author` (ObjectId, ref: 'User'), `status: draft|published`, `publishAt`, timestamps.
- Создан `backend/src/controllers/news.controller.js` — `createNews`, `getNews` (пагинация, публичный список vs `?all=1`), `getNewsById`, `updateNews`, `deleteNews` (право автора — 403 для чужих).
- Создан `backend/src/routes/news.routes.js` — все маршруты под `router.use(authMiddleware)` (требование ТЗ: endpoints только для авторизованных). Подключён в `app.js` как `app.use('/api/news', newsRoutes)`.
- **Отложенная публикация = данные, а не таймер** (см. ADR 0001): при чтении фильтр `status === 'published' && publishAt <= now`; `publishNow: true` — публикация сразу; `publishAt` в будущем — черновик, который станет публичным после наступления даты.
- ⚠️ Инцидент с усечённым именем файла роутера (`news.routes` без `.js`) — исправлен: создан `news.routes.js`, ошибочный файл удалён.
- **Проверка (без БД):** GET/POST /api/news без токена → 401; с битым токеном → 401.
- Создан учебник `docs/history/phase-3-news-crud.md` (публикация-как-фильтр, право автора, пагинация, curl-сценарии). Обновлён `PROGRESS.md` (3.1–3.4 = ✅).
- Переход на MCP `filesystem` для записи/правки файлов (надёжнее терминала).
- ❗ Команды фазы 3: создание файлов через MCP filesystem; проверка через `node -e` + `fetch` (401/401).
- **Фаза 3 завершена.** Следующее: вставить реальный `MONGO_URI` из Atlas в `backend/.env` и прогнать curl-сценарии регистрации + CRUD новостей (учебник, раздел 4).

---

## [4.x] — Файлы и статика (Фаза 4)

### 2026-08-11
- `cd backend && npm install multer` — библиотека для multipart/form-data.
- Создан `backend/src/config/upload.js` — diskStorage в `uploads/`, уникальные имена файлов, MIME-фильтр (картинки/PDF/doc/docx), лимит 5 МБ; ошибкам fileFilter присвоен `status: 400`.
- Создан `backend/src/controllers/upload.controller.js` — возвращает `{ url, name, size, mimetype }` по `req.file`.
- Создан `backend/src/routes/upload.routes.js` — `POST /api/upload` (authMiddleware + `upload.single('file')`).
- `backend/src/app.js`: подключён роутер `/api/upload`; добавлена раздача статики `app.use('/uploads', express.static(...))`; добавлен **централизованный error handler** (4 параметра, `err.status || 500`, JSON-ответ вместо голого стека).
- **Проверка (через файл + filesystem):** upload без токена → 401; неразрешённый MIME → 400 «Тип файла не поддерживается»; image/png → 201 + url; GET `/uploads/<файл>` → 200 + реальный PNG; health → 200.
- ⚠️ Инцидент: первый тест дал 401 на любой токен — тест запускался без dotenv, `JWT_SECRET` был undefined. В standalone-тестах задаём `process.env.JWT_SECRET` вручную.
- Создан учебник `docs/history/phase-4-files.md` (multipart/form-data, multer, MIME, error handler, express.static, вопросы). Обновлён `PROGRESS.md` (4.1–4.2 = ✅).
- ❗ Команды фазы 4 (журнал): `npm install multer`; тест через короткий `node -e "..."` (запись в файл, чтение через filesystem) — длинные команды заменены на файлы-результаты.
- **Фаза 4 завершена.**

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