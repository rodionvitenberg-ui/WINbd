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

### 2026-08-11
- `cd backend && npm install socket.io` и `npm install --save-dev socket.io-client` (клиент — для теста).
- Создан `backend/src/utils/socket.js` — синглтон: `initIO(server)` (создаёт Server с CORS из `.env`, логирует connect/disconnect) и `getIO()` (бросает ошибку, если не инициализирован).
- `backend/src/server.js`: `app.listen()` заменён на `http.createServer(app)` + `initIO(server)` + `server.listen(PORT)`.
- `backend/src/controllers/news.controller.js`: `getIO().emit(...)` в createNews (`news:created`), updateNews (`news:updated`), deleteNews (`news:deleted`) — передаём `{ id, title, status }`.
- **Проверка:** временный скрипт `test-socket.js` поднял сервер + клиент (socket.io-client); клиент получил `news:created` и `news:updated` — real-time работает. Скрипт и файлы результата удалены.
- Создан учебник `docs/history/phase-5-real-time.md` (HTTP vs WebSocket, синглтон, http.createServer, emit; 10 вопросов). Обновлён `PROGRESS.md` (5.1–5.2 = ✅).
- ❗ Команды фазы 5 (журнал): `npm install socket.io`; `npm install --save-dev socket.io-client`; тест через короткий `node test-socket.js` (результат в файл → filesystem).
- **Фаза 5 завершена.**

---

## [6.x] — Frontend: скелет (Фаза 6)

### 2026-08-11
- **Решение владельца:** переход с Vite на **Next.js App Router + TypeScript** (портфолио-вес, знакомство с фреймворком, Vercel-деплой по ТЗ). Обновлены манифесты: `.clinerules.md`, `CLAUDE.md`, `ROADMAP.md`, `README.md`, `DESIGN.md`.
- Инициализация: `npx create-next-app@latest frontend --ts --app --no-tailwind --src-dir --use-npm --eslint --no-git --import-alias "@/*" --yes`.
- `cd frontend && npm install axios sass socket.io-client` (socket.io-client для фазы 8 — колокольчик).
- Созданы: `src/types/api.ts` (зеркало бэкенда), `src/api/client.ts` (axios + интерцептор JWT), `src/context/AuthContext.tsx` (login/register/logout/восстановление сессии), `src/components/Navigation.tsx`.
- SCSS по DESIGN.md: `_variables`, `_base`, `_components`, `main.scss` (импорт в `layout.tsx`).
- Страницы (App Router): `/` (список), `/login`, `/register`, `/news/[id]` (рендер блоков: text/image/quote/code/file), `/editor` (защищённая, каркас с заголовком; блоки — Фаза 7).
- Удалены дефолтные `globals.css`, `page.module.css`. Созданы `frontend/.env.example` и `.env.local` (`NEXT_PUBLIC_API_URL=http://localhost:5000`).
- **Проверка:** `npm run build` — успешно (TypeScript ок, все 5 маршрутов).
- Создан учебник `docs/history/phase-6-frontend-core.md`. Обновлён `PROGRESS.md` (6.1–6.3 = ✅).
- ❗ Команды фазы 6 (журнал): `create-next-app ...`; `npm install axios sass socket.io-client`; `rm` дефолтных CSS; `npm run build`.
- **Фаза 6 завершена.**

---

## [7.x] — Блочный редактор (Фаза 7)

### 2026-08-11
- Компоненты-редакторы блоков (только функциональные + хуки): `TextBlock` (style: paragraph/h1/h2/bold/italic), `ImageBlock`, `QuoteBlock`, `CodeBlock` (языки), `FileBlock`.
- `BlockEditor.tsx` — «роутер» по типу блока; `BlockPreview.tsx` — предпросмотр одного блока; `Toolbar.tsx` — кнопки добавления; `UploadButton.tsx` — загрузка файла через `/api/upload` (FormData → url).
- `Editor.tsx` — ядро: `useState<Block[]>`, add/update/remove/move, переключатель «Редактор / Предпросмотр», сохранение черновика, публикация сейчас (`publishNow: true`) и отложенная (`publishAt`).
- `editor/page.tsx` — интеграция `<Editor />` (защита авторизации сохранена).
- SCSS: тулбар, блоки, предпросмотр, загрузка, публикация.
- **Проверка:** `cd frontend && npm run build` — успешно (TypeScript ок, все маршруты).
- Создан учебник `docs/history/phase-7-editor.md` («редактор = массив блоков», управляемые компоненты, публикация = данные). Обновлён `PROGRESS.md` (7.1–7.4 = ✅).
- ⚠️ По просьбе владельца: коммиты пока не делаем (фазу 6 фикс и фазу 7 — в рабочем дереве).
- **Фаза 7 завершена.**

---

## [8.x] — Уведомления на клиенте (Фаза 8) ⭐

### 2026-08-11
- `frontend/src/components/notifications/NotificationsProvider.tsx` — контекст: один socket.io-client (websocket, авто-reconnect), слушатели `news:created/updated/deleted`, стек `notifications[]` (max 30), `unreadCount`, `clear`. Защита от SSR: `typeof window !== 'undefined'`.
- `frontend/src/components/notifications/Bell.tsx` — колокольчик: бейдж счётчика, выпадающая панель, список уведомлений, кнопка «Очистить», закрытие по клику вне.
- Интеграция: `layout.tsx` оборачивает приложение в `<NotificationsProvider>`, `Navigation.tsx` выводит `<Bell />` (только авторизованным).
- SCSS: `.bell-*` + анимация `bell-shake` (из DESIGN.md).
- **Проверка:** `cd frontend && npm run build` — успешно.
- Создан учебник `docs/history/phase-8-bell.md` (синглтон-сокет, SSR-guard, поллинг vs WebSocket). Обновлён `PROGRESS.md` (8.1–8.2 = ✅).
- **Фаза 8 завершена.** Дальше — полировка и публикация (Фаза 9).

---

## [9.x] — Полировка и публикация (Фаза 9)

### 2026-08-11
- **Полировка UI** (скиллы impeccable-design-polish + better-ui):
  - `scale(0.96)` при нажатии на кнопках (+ `:focus-visible` ring);
  - фокус-свечение полей ввода (`box-shadow 0 0 0 3px`);
  - «image outlines» для картинок в тёмной теме (`1px oklch(1 0 0 / 0.1)`, outline-offset -1px);
  - `@media (prefers-reduced-motion: reduce)` — отключение анимации колокольчика, hover-подъёма карточек и scale-on-press;
  - переходы сужены до конкретных свойств (без `transition: all`).
- **Проверка:** `cd frontend && npm run build` — успешно.
- Обновлён `PROGRESS.md` (9.1 = ✅).

### 2026-08-13 — закрытие UI-пробелов (HANDOVER, пункт 4.1) + полировка
- **Редактирование новости:** `frontend/src/app/editor/page.tsx` читает `?id=...` из URL, загружает новость (`GET /api/news/:id`) и передаёт в `<Editor initialNews />`. `Editor.tsx` теперь: инициализирует `title`/`blocks`/`publishAt` из существующей новости, при сохранении выбирает `PUT /api/news/:id` (а не `POST`), заголовок «Редактирование новости». Хелпер `toDatetimeLocal()` переводит ISO-дату в формат `datetime-local` по локальному времени.
- **Удаление новости из UI:** `frontend/src/app/news/[id]/page.tsx` — если текущий пользователь — автор (`user._id === news.author`), показывает кнопки «Редактировать» (`/editor?id=...`) и «Удалить» (confirm → `DELETE /api/news/:id` → редирект на `/`). Кнопка удаления получила `btn--danger` (красный hover только для опасных действий).
- **«Мои новости»:** `frontend/src/app/page.tsx` — вкладки «Все»/«Мои» (для авторизованных); «Мои» грузятся через `GET /api/news?all=1` (черновики + отложенные + опубликованные). Создан `frontend/src/components/news/NewsCard.tsx` — переиспользуемая карточка: кликабельная часть (`Link`), дата, в режиме «Мои» — бейдж статуса («Опубликовано»/«Отложено»/«Черновик» по ADR 0001) и кнопки Редактировать/Опубликовать/Удалить.
- **Полировка SCSS** (`frontend/src/styles/_components.scss`):
  - `btn--sm` (компактные кнопки), `btn--danger` (опасные действия);
  - бейджи статусов по DESIGN.md (полупрозрачная заливка зелёный/синий/жёлтый);
  - fade-up появление карточек (`@keyframes news-card-in`), отключение в `prefers-reduced-motion`;
  - фокус-кольцо на кликабельной части карточки и на кнопке колокольчика;
  - `bell__panel` ограничен `max-width: calc(100vw - 24px)` — не вылезает за экран на мобильных;
  - адаптивность шапки (`@media max-width: 640px`), футера карточки и кнопок редактора.
- **Проверка:** `cd frontend && npm run build` — успешно (TypeScript ок, все маршруты).
- Обновлены `PROGRESS.md` (9.2–9.5 = ✅) и этот `CHANGELOG.md`.

### 2026-08-13 (вечер) — полное тестирование по скиллу diagnosing-bugs
- **E2E-скрипт backend** (`backend/test-e2e.tmp.js`, временный — удалён после прогонов): 39 проверок — health, CORS, auth (register/login/me), news CRUD, отложенная публикация, права автора, валидации, пагинация, upload (MIME-фильтр, статика), socket (created/updated/deleted). Прогнан 3 раза — 39/39 зелёный.
- **Найден и исправлен Баг A:** публичный `GET /api/news` и `GET /api/news/:id` требовали токен (401 у гостей) — главная страница для неавторизованных была сломана. Причина: `router.use(authMiddleware)` вешал строгую защиту на все маршруты. Решение: создан `backend/src/middleware/optionalAuth.middleware.js` («мягкая» проверка токена — `req.user` если прислан, иначе гость); `news.routes.js`: POST/PUT/DELETE — `authMiddleware`, GET — `optionalAuthMiddleware`; контроллер возвращает 401 только для `?all=1` без токена.
- **Найден и исправлен Баг B:** невалидный `ObjectId` (`/api/news/not-an-object-id`) давал 500. Причина: CastError не обрабатывался. Решение: валидация формата id `^[0-9a-fA-F]{24}$` → 404 в `getNewsById`, `updateNews`, `deleteNews`; `isOwner` стал безопасным для гостей (`Boolean(req.user && ...)`).
- **ESLint:** исправлены 4 ошибки `react-hooks/set-state-in-effect` (AuthContext, editor/page, page) + `<a>` → `<Link>` в editor/page. Итог: `npm run lint` → 0 errors (2 `no-img-element` warning оставлены осознанно — изображения приходят из /uploads). `npm run build` — зелёный.
- Временный e2e-скрипт удалён. Обновлены `PROGRESS.md` (9.6–9.7 = ✅) и этот `CHANGELOG.md`.

### Планируется (остаток)
- Деплой backend (Render/Railway/Fly.io), frontend (Vercel). Решение владельца — собственный сервер (см. HANDOVER, раздел 6).
- Финальный README, синхронизация `news-editor`, push в оба репозитория, самоанализ.
- Учебник: этот файл `docs/history/phase-9-polish.md`.
- Напомнить: коммиты приостановлены владельцем — в дереве не только полировка, но и фиксы фазы 6–8.
