# WINbd — сводка для агентов и разработчиков

> Краткий справочник. Подробные правила — в `.clinerules.md`, план — в `ROADMAP.md`, журнал — в `PROGRESS.md`, учебник по фазам — в `docs/history/`.

## 🎯 Что это

Тестовое задание «Редактор новостных статей»:

- **Backend** (`./backend`, Node.js + Express + MongoDB/Mongoose, MongoDB Atlas):
  - JWT-авторизация (bcrypt для паролей), middleware проверки токена;
  - CRUD новостей + **отложенная публикация** (по дате, заданной автором);
  - загрузка файлов (multer) и раздача статики;
  - real-time уведомления (Socket.io) о создании/изменении/удалении новостей. ⭐
- **Frontend** (`./frontend`, React + Vite):
  - блочный редактор: текст с форматированием, картинки, цитаты, код ⭐, файлы;
  - предпросмотр статьи, колокольчик уведомлений ⭐, SCSS.

## 🛠 Активные MCP-серверы

- **postgres** — не используется (проект на MongoDB), но доступен для справки.
- **filesystem** — локальный доступ к файлам.
- **sequential-thinking** — для сложного проектирования и логики.
- **github** — создание репозитория, push.

## 💻 Команды

**Backend** (из `./backend`):
- `npm run dev` — nodemon + автоперезапуск;
- `npm start` — обычный запуск;
- `npm install <pkg>` — установка пакета.

**Frontend** (из `./frontend`):
- `npm run dev` — Vite dev-сервер;
- `npm run build` — продакшн-сборка;
- `npm run preview` — локальный просмотр сборки.

## 📜 Домен

- **User:** `email` (уникальный, lowercase), `passwordHash`.
- **News:** `title`, `blocks[]`, `author (ObjectId)`, `status: 'draft'|'published'`, `publishAt`.
- **Блоки** (поле `type`):
  - `text` — `{ text, style }`, style: `paragraph | h1 | h2 | bold | italic`;
  - `image` — `{ url, caption }`;
  - `quote` — `{ text, author }`;
  - `code` — `{ code, language }`;
  - `file` — `{ url, name, size }`.
- **Отложенная публикация = фильтр:** `status === 'published' && publishAt <= now`, без таймеров.

## 🧠 Режим обучения

Владелец изучает Node.js и MongoDB. Каждый шаг:

1. Объясни «почему так, а не иначе» + альтернативы.
2. Покажи код маленькими кусками.
3. Проверь руками (curl/Postman/браузер/Compass).
4. Обнови `PROGRESS.md`, `CHANGELOG.md`, файл текущей фазы в `docs/history/`.

Все комментарии и документация — **на русском языке**.