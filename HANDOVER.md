# HANDOVER — инструкция следующему разработчику

> Этот файл — «эстафетная палочка» от предыдущего кодерa. Пожалуйста, прочитай его целиком перед первой правкой и удали, когда новый человек (или следующий сеанс) разберётся в проекте.

**Состояние на момент передачи:** работающий проект, backend полностью соответствует ТЗ, frontend закрывает «создание статей», CORS починен (frontend :3000 ↔ backend :5000). Осталось: 3 UI-пробела и полировка. Деплой — на собственный сервер владельца (см. раздел «Деплой»).

---

## 1. Что это за проект

Редактор новостных статей (тестовое задание): авторизация JWT, блочный редактор (текст/картинки/цитаты/код/файлы), отложенная публикация, загрузка файлов, real-time уведомления.

**Два репозитория (важно не путать):**

| Репозиторий | Роль | Что внутри |
|---|---|---|
| `WINbd` (этот) | Рабочий/учебный | Код + `.clinerules.md`, `CLAUDE.md`, `CONTEXT.md`, `docs/` (учебники), `PROGRESS.md`, `CHANGELOG.md` |
| `news-editor` (`rodionvitenberg-ui/news-editor`) | Чистый, для эксплуатации | Только `backend/`, `frontend/`, `README.md`, `LICENSE`, `.gitignore`. Без учебных файлов и без секретов |

> **Правило синхронизации:** любые правки кода вноси в `WINbd`, проверь, затем **скопируй изменённые файлы в `news-editor`** и закоммить оба репозитория, чтобы чистый не отставал.

---

## 2. Стек и запуск

- Backend: Node.js + Express + MongoDB (Mongoose, Atlas) + Socket.io. Точка входа `backend/src/server.js`.
- Frontend: Next.js (App Router) + TypeScript + SCSS. Папка `frontend/`.

```bash
# Backend (терминал 1)
cd backend && npm install
cp .env.example .env   # заполни MONGO_URI, JWT_SECRET, JWT_EXPIRES_IN, CORS_ORIGIN
npm run dev            # http://localhost:5000

# Frontend (терминал 2)
cd frontend && npm install
cp .env.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:5000
npm run dev                  # http://localhost:3000
```

Проверка: открыть `http://localhost:3000`, зарегистрироваться, создать/опубликовать статью, вторая вкладка — колокольчик в реальном времени.

---

## 3. Что уже сделано (карта)

### Backend (готово полностью)
- Авторизация: `POST /api/auth/register`, `/login` → JWT; `/me` извлекает id из токена. bcrypt.
- Middleware `auth.middleware.js` — на всех `/api/news` и `/api/upload`.
- Новости: CRUD + публикация сейчас/по дате. Отложенная публикация — данные, а не таймер: фильтр `status==='published' && publishAt<=now` (см. `docs/adr/0001-...`).
- Файлы: `multer` → `backend/uploads/`, раздача через `/uploads` (express.static).
- Real-time: `utils/socket.js` (синглтон `initIO/getIO`), события `news:created/updated/deleted`.

### Frontend (готово: создание статей)
- `AuthContext`, axios-клиент с авто-JWT (`api/client.ts`).
- Страницы: `/`, `/login`, `/register`, `/editor`, `/news/[id]`.
- Редактор: `components/editor/` — `Editor`, `Toolbar`, `BlockEditor`, `BlockPreview`, `UploadButton`, `blocks/*`.
- Колокольчик: `components/notifications/` — `NotificationsProvider`, `Bell`.
- SCSS: `styles/_variables`, `_base`, `_components`, `main`.

---

## 4. Что осталось сделать (основной блок)

### 4.1. UI-пробелы (важно, backend уже готов)

1. **Редактирование существующей новости**
   - Сейчас: `/editor` создаёт только новую. Нужно: если в URL есть `?id=...`, загрузить новость (`GET /api/news/:id`), подставить `title` и `blocks` в `Editor`, сохранять через `PUT /api/news/:id`.
   - Где: `frontend/src/app/editor/page.tsx`, `frontend/src/components/editor/Editor.tsx`.

2. **Удаление новости из UI**
   - Сейчас: на странице `/news/[id]` нет кнопки. Нужно: кнопка «Удалить» (только автору), c `confirm`, затем `DELETE /api/news/:id` и редирект на `/`.

3. **«Мои новости»**
   - Бэкенд уже умеет `GET /api/news?all=1` (возвращает черновики, отложенные и опубликованные). Нужно: на главной вкладка/фильтр «Мои», кнопки «Редактировать/Удалить/Опубликовать», бейджи статусов «Черновик» / «Отложено» / «Опубликовано».

### 4.2. Полировка
- Пустые/loading/error-состояния во всех списках (частично есть).
- Адаптивность шапки, редактора, колокольчика.
- Проверить, что `prefers-reduced-motion` применяется (уже частично в `_components.scss`).
- Прогнать скиллы `impeccable-design-polish` и `better-ui` (находятся вне репозитория в `skills*` — они игнорируются git) после правок UI.

---

## 5. Как ЗАКАНЧИВАТЬ проект (чек-лист сдачи, помимо деплоя)

1. **Код**: только функциональные компоненты и хуки; никаких `any`; JSDoc/комментарии на русском; без TODO-заглушек.
2. **Проверка**: `cd frontend && npm run build` — зелёный; на бэке прогнать e2e-сценарий (health, register/login/me, news CRUD, upload, socket-событие).
3. **Манифесты**: обновить `PROGRESS.md` (колонка «Понял ли?») и `CHANGELOG.md`.
4. **Оба репозитория**: закоммитить и запушть правки в `WINbd` И в `news-editor` (копия изменённых файлов), чтобы чистый не отставал.
5. **README чистого репозитория**: дополнить, если появились новые API/фичи.
6. **Финальный осмотр**: пройти UI как пользователь (регистрация → создание → публикация → просмотр → колокольчик), убедиться в отсутствии битых ссылок и ошибок консоли.

---

## 6. Деплой (решение владельца: собственный сервер)

Backend и frontend деплоятся на **собственный сервер владельца** (домен + сервер). Не Vercel/Render.

Примерная схема:
- Backend: долгоживущий Node-процесс (`npm start`, порт 5000), под process manager (PM2 или systemd); nginx — reverse proxy: `/api` и `/socket.io` (для WebSocket) проксируются на `localhost:5000`; HTTPS через certbot.
- Frontend: `cd frontend && npm run build && npm start` (Next.js отдаёт собранное), тоже за nginx; `CORS_ORIGIN` на бэке = публичный домен фронта.

---

## 7. Правила работы (кратко)

- Глобальные правила не менять; этому проекту — локальный `.clinerules.md`.
- Объяснять каждое решение «почему так, а не иначе» — проект учебный.
- Обновлять манифесты после каждого шага.

Удачи! Проект в хорошем состоянии и близок к сдаче.
