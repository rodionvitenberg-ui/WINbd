# WINbd — Редактор новостных статей

> Тестовое задание: полноценный редактор новостных статей с авторизацией, отложенной публикацией, загрузкой файлов и real-time уведомлениями.

**Стек:** Node.js + Express + MongoDB (Mongoose, Atlas) · Next.js (App Router) + TypeScript · JWT · bcrypt · Socket.io · SCSS

---

## 📦 Возможности

### Backend (`./backend`)
- Регистрация/авторизация пользователя, выдача **JWT** (из токена можно получить id пользователя). ⭐
- **Middleware** проверки валидного токена для сущности `news`.
- Создание, редактирование, удаление и **публикация** новостей.
- **Отложенная публикация** — по дате, заданной автором (без таймеров, через фильтр при запросе).
- CORS.
- Загрузка файлов с клиента и раздача статики.
- **Real-time уведомления** при создании/изменении/удалении новостей (Socket.io). ⭐

### Frontend (`./frontend`)
- Блочный редактор: **текст** с форматированием (заголовки, жирный, курсив), **картинки**, **цитаты**, **куски кода** ⭐, **файлы** (pdf, doc и т.п.).
- **Предпросмотр** статьи.
- **«Колокольчик» уведомлений** real-time. ⭐
- SCSS-стили.
- Только функциональные компоненты и хуки.

⭐ — задания со звёздочкой из ТЗ.

---

## 🚀 Быстрый старт

### 1. Требования
- Node.js 18+ и npm.
- MongoDB Atlas (бесплатный кластер M0) — connection string вида `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<db>?retryWrites=true&w=majority`.

### 2. Backend

```bash
cd backend
npm install
# создай файл .env по образцу .env.example
npm run dev
```

Сервер поднимется на `http://localhost:5000` (порт задаётся в `.env`). Фронтенд (Next.js) в dev слушает `http://localhost:3000` — в `CORS_ORIGIN` указывай именно его.

### 3. Frontend

```bash
cd frontend
npm install
# создай .env.local по образцу .env.example (NEXT_PUBLIC_API_URL=http://localhost:5000)
npm run dev
```

Приложение откроется на `http://localhost:3000` (стандартный порт Next.js).

---

## 🌐 Структура проекта

```
WINbd/
├── .clinerules.md          # правила для агентов
├── CLAUDE.md               # сводка для агентов
├── DESIGN.md               # дизайн-система
├── ROADMAP.md              # план фаз
├── PROGRESS.md             # журнал прогресса
├── CHANGELOG.md            # хронология изменений
├── docs/history/           # учебники по фазам
├── backend/
│   ├── src/
│   │   ├── server.js
│   │   ├── app.js
│   │   ├── config/db.js
│   │   ├── models/         # User, News
│   │   ├── routes/         # auth, news, upload
│   │   ├── controllers/    # логика обработки запросов
│   │   ├── middleware/     # auth, error
│   │   └── utils/
│   └── uploads/            # загруженные файлы
└── frontend/               # Next.js (App Router) + TypeScript
    ├── src/
    │   ├── app/            # страницы: login, register, news/[id], editor
    │   ├── api/            # axios-клиент с JWT
    │   ├── context/        # AuthContext
    │   ├── components/     # editor, notifications, news
    │   ├── types/          # TypeScript-типы (User, News, Block)
    │   └── styles/         # SCSS
    └── package.json
```

---

## 🔑 API (кратко)

| Метод | Путь | Доступ | Назначение |
|---|---|---|---|
| POST | `/api/auth/register` | публично | Регистрация (bcrypt) |
| POST | `/api/auth/login` | публично | Логин → JWT |
| GET | `/api/auth/me` | авторизован | Данные по токену |
| GET | `/api/news` | авторизован | Список новостей |
| POST | `/api/news` | авторизован | Создать новость |
| GET | `/api/news/:id` | авторизован | Одна новость |
| PUT | `/api/news/:id` | автор | Изменить новость |
| DELETE | `/api/news/:id` | автор | Удалить новость |

Полное описание — в учебниках фаз `docs/history/`.

---

## 📚 Документация проекта

- `docs/history/phase-XX-nazvanie.md` — **учебники по фазам**: цели, объяснения концепций, альтернативы и выбор, все использованные команды, примеры кода, вопросы для самопроверки.

---

## 🧑‍🎓 Режим обучения

Проект развивается в **учебном режиме**: владелец изучает Node.js и MongoDB. Каждый шаг объясняется «почему так, а не иначе», показывается код и фиксируется прогресс в `PROGRESS.md`. Отслеживание понимания — через колонку «Понял ли?» в журнале прогресса.