# WINbd — роадмап

> План проекта по фазам. Каждая фаза получает **свой файл-учебник** в `docs/history/` (человеческим языком, с объяснениями «почему так», альтернативами и командами) и отмечается в `PROGRESS.md`.
> ⭐ — задания со звёздочкой из ТЗ (второй приоритет, но мы делаем и их).

---

## Фаза 0 — Фундамент: правила, манифесты, git/GitHub

**Цель:** заложить основу, на которую будут опираться все будущие агенты и сам владелец: правила, документация, учебник, репозиторий.

**Задачи:**
- [x] Согласовать план (Atlas, формат работы «ты кодишь + объясняешь», русские комментарии, репозиторий создаёт агент).
- [x] `.clinerules.md` — правила проекта.
- [x] `CLAUDE.md` — сводка для агентов.
- [x] `DESIGN.md` — дизайн-система.
- [ ] `ROADMAP.md` — эта карта.
- [ ] `PROGRESS.md` — журнал прогресса.
- [ ] `CHANGELOG.md` — хронология изменений.
- [ ] `README.md` — описание и запуск.
- [ ] `docs/history/phase-0-fundament.md` — учебник фазы 0 (включая все git/GitHub команды).
- [ ] Структура папок `backend/` и `frontend/` (каркас).
- [ ] `git init`, первый коммит, GitHub-репозиторий, первый push.

**Учебник:** `docs/history/phase-0-fundament.md`

---

## Фаза 1 — Backend: каркас (Express + MongoDB + CORS)

**Цель:** поднять работающий API-сервер: Express, подключение к MongoDB Atlas, CORS, health-check.

**Задачи:**
- `npm init`, установка `express`, `mongoose`, `dotenv`, `cors`, `nodemon` (dev).
- `.env` / `.env.example` (MONGO_URI, JWT_SECRET, PORT).
- `src/server.js`, `src/app.js`, `src/config/db.js`.
- Endpoint `/api/health`.
- Первичная настройка CORS.

**Учим:** путь запроса `request → middleware → route → controller → model → БД → response`.

**Учебник:** `docs/history/phase-1-backend-core.md`

---

## Фаза 2 — Авторизация ⭐

**Цель:** регистрация/логин, JWT, middleware проверки токена.

**Задачи:**
- Модель `User` (email, passwordHash).
- `POST /api/auth/register` — bcrypt.hash.
- `POST /api/auth/login` — bcrypt.compare → jwt.sign.
- `GET /api/auth/me` — защищённый (пример из ТЗ: из JWT получаем id пользователя).
- Middleware `auth.middleware.js`.

**Учим:** JWT изнутри, bcrypt, stateless-авторизация, хранение токена на клиенте.

**Учебник:** `docs/history/phase-2-auth.md`

---

## Фаза 3 — News CRUD + отложенная публикация ⭐

**Цель:** полноценные endpoints для сущности news (только для авторизованных).

**Задачи:**
- Модель `News` (title, blocks[], author, status, publishAt).
- `GET/POST /api/news`, `GET/PUT/DELETE /api/news/:id`.
- Публикация сейчас и по дате (`publishAt`).
- **Отложенная публикация = фильтр `status==='published' && publishAt <= now`**, без таймеров.

**Учим:** CRUD + mongoose, «данные, а не таймер».

**Учебник:** `docs/history/phase-3-news-crud.md`

---

## Фаза 4 — Файлы и статика

**Цель:** загрузка файлов с клиента и раздача статики.

**Задачи:**
- `multer` для загрузки (images, pdf, doc).
- `express.static('/uploads')`.
- Ограничения: размер, типы файлов.

**Учим:** multipart/form-data, почему загрузка — отдельный endpoint.

**Учебник:** `docs/history/phase-4-files.md`

---

## Фаза 5 — Real-time ⭐

**Цель:** уведомления при создании/изменении/удалении новостей.

**Задачи:**
- `socket.io` на сервере.
- Эмиссия `news:created`, `news:updated`, `news:deleted`.

**Учим:** WebSocket vs HTTP, event loop Node.js.

**Учебник:** `docs/history/phase-5-real-time.md`

---

## Фаза 6 — Frontend: скелет (Vite + React + роутинг + auth)

**Цель:** поднять SPA, авторизацию на клиенте, защиту маршрутов.

**Задачи:**
- Vite + React (функциональные компоненты, хуки).
- `react-router-dom`, страницы Login/Register/NewsList/Editor.
- `AuthContext`, axios-клиент с JWT.
- SCSS-структура из `DESIGN.md`.

**Учим:** useState/useEffect/useContext, защищённые маршруты.

**Учебник:** `docs/history/phase-6-frontend-core.md`

---

## Фаза 7 — Блочный редактор (главная фича)

**Цель:** редактор новостных статей: текст с форматированием, картинки, цитаты, код ⭐, файлы, предпросмотр.

**Задачи:**
- `Editor` + `Toolbar`, массив блоков.
- Блоки: `text` (параграф/заголовки/жирный/курсив), `image`, `quote`, `code` ⭐, `file`.
- Перемещение/удаление блоков, предпросмотр.
- Сохранение и публикация (включая отложенную).

**Учим:** управление сложным состоянием, симметрия данных React ↔ MongoDB.

**Учебник:** `docs/history/phase-7-editor.md`

---

## Фаза 8 — Уведомления на клиенте ⭐

**Цель:** «колокольчик» для отображения изменений в новостных статьях.

**Задачи:**
- `socket.io-client`.
- `Bell.jsx`, список и счётчик уведомлений.
- Анимация из `DESIGN.md`.

**Учебник:** `docs/history/phase-8-bell.md`

---

## Фаза 9 — Полировка и публикация

**Цель:** финальное оформление и публикация проекта.

**Задачи:**
- Адаптивность, доработка SCSS.
- Деплой backend → Render/Railway/Fly.io (Vercel не держит WebSocket).
- Деплой frontend → Vercel.
- Финальный README, push, итоговый самоанализ в PROGRESS.md.

**Учебник:** `docs/history/phase-9-polish.md`

---

## Принципы движения

1. Фаза считается **завершённой**, когда владелец подтвердил понимание (`PROGRESS.md`, колонка «Понял ли?» = ✅).
2. Код выдаётся **одним логическим шагом за раз**.
3. Каждая фаза фиксирует **все команды** (npm, git, curl) в своём учебнике.
4. После UI-фаз — обязательный прогон через `use_skill("impeccable-design-polish")`.