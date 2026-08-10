# Фаза 6 — Frontend-скелет (Next.js App Router + TypeScript)

> **Учебник.** Человеческим языком: почему мы взяли Next.js, как устроен App Router, зачем нужны типы, AuthContext и axios-интерцептор, и как фронтенд «разговаривает» с нашим бэкендом.

**Дата:** 2026-08-11 · **Время:** Asia/Bishkek (UTC+6)

---

## 1. Решение по стеку: Next.js вместо Vite

ТЗ требует React, функциональные компоненты, хуки и github — всё это Next.js выполняет. Владелец проекта попросил Next.js + TypeScript: фреймворк ему знаком, а для портфолио это весомее чем Vite. Vercel (желанный деплой по ТЗ) это родная платформа Next.js — идеальный матч.

**Как мы используем Next.js?** У нас отдельный backend API (Express на :5000), поэтому Next.js работает в **клиентском режиме**: страницы с `'use client'`, состояние через хуки, запросы через axios. SSR/Server Components нам не нужны — но Next.js это не блокирует.

**Почему App Router?** Это современный стандарт Next.js 13+; файловая структура папки `src/app/` сама создаёт маршруты.

---

## 2. Ключевые концепции

### 2.1. App Router — «папка = маршрут»

```
src/app/
├── layout.tsx          # корневой layout (SCSS + AuthProvider)
├── page.tsx            # маршрут /
├── login/page.tsx      # /login
├── register/page.tsx   # /register
├── news/[id]/page.tsx  # /news/<id> (динамический сегмент)
└── editor/page.tsx     # /editor
```

Файл `page.tsx` внутри папки становится страницей. `[id]` — динамический сегмент, доступен через `useParams()`. App Router сам генерирует типы маршрутов (в консоли: «Types generated successfully»).

### 2.2. `'use client'` — когда нужен клиентский код

Каждая страница с хуками (`useState`, `useEffect`, `useAuth`) обязана начинаться с `'use client'` — директива говорит Next.js: этот компонент — клиентский (не Server Component). Именно так мы работаем со «временем жизни» приложения: браузерные API, useState, эффекты.

### 2.3. TypeScript-типы — зеркало бэкенда

`frontend/src/types/api.ts` повторяет то, что возвращает Express API: `User`, `AuthResponse`, `News`, `Block`, `NewsListResponse` и т.д. **Правило Type Synchronization:** если бэкенд меняет формат — типы обновляются в той же итерации. Никаких `any`.

### 2.4. axios-клиент и интерцептор JWT

`src/api/client.ts` — единственный экземпляр axios с базой из `NEXT_PUBLIC_API_URL`:

```ts
export const apiClient = axios.create({ baseURL });

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('winbd_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

**Интерцептор** — перехватчик: перед КАЖДЫМ запросом добавляет заголовок `Authorization: Bearer <токен>`. Компоненты даже не думают про токен — он подставляется автоматически.

### 2.5. `NEXT_PUBLIC_*` — переменные, видимые на клиенте

Обычные переменные Next.js (`SECRET_*`) видны только на сервере. Префикс `NEXT_PUBLIC_` делает переменную доступной и в браузере (она вшивается в сборку). Отсюда `NEXT_PUBLIC_API_URL=http://localhost:5000`.

### 2.6. AuthContext — «глобальная» авторизация через Context API

`src/context/AuthContext.tsx`:

- `AuthProvider` — оборачивает приложение (в layout.tsx) и хранит `user`, `token`, `loading`.
- `login` / `register` / `logout` — вызовы API + запись/очистка `localStorage`.
- `useAuth()` — хук для любого компонента: удобно, без prop drilling.
- При монтировании пробует восстановить сессию: читает токен из localStorage и проверяет его через `GET /api/auth/me`.

Защита маршрутов: страница `/editor` редиректит на `/login`, если `useAuth()` вернул `user: null`.

### 2.7. SCSS в Next.js

`sass` уже поддержан Next.js: достаточно установить пакет и импортировать корневой `main.scss` в `layout.tsx`. Структура — по `DESIGN.md` (`@use './variables'` → `base` → `components`).

---

## 3. Файлы фазы

```
frontend/
├── .env.example              # шаблон: NEXT_PUBLIC_API_URL
├── .env.local                # реальная переменная (gitignore)
└── src/
    ├── app/
    │   ├── layout.tsx        # SCSS + AuthProvider
    │   ├── page.tsx          # список новостей
    │   ├── login/page.tsx
    │   ├── register/page.tsx
    │   ├── news/[id]/page.tsx  # рендер блоков статьи
    │   └── editor/page.tsx     # защищённый каркас редактора
    ├── api/client.ts         # axios + интерцептор JWT
    ├── context/AuthContext.tsx
    ├── components/Navigation.tsx
    ├── styles/  (_variables, _base, _components, main)
    └── types/api.ts          # зеркало бэкенд-API
```

---

## 4. Использованные команды (журнал)

```bash
# Инициализация Next.js (App Router, TS, src, без Tailwind, без вложенного git)
rm -rf frontend
npx --yes create-next-app@latest frontend --ts --app --no-tailwind --src-dir --use-npm --eslint --no-git --import-alias "@/*" --yes

# Пакеты
cd frontend && npm install axios sass socket.io-client

# Удаление дефолтного CSS и CSS-модуля (мы используем SCSS)
rm -f frontend/src/app/globals.css frontend/src/app/page.module.css

# Проверка сборки
cd frontend && npm run build
```

Результат сборки:

```
Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /editor
├ ○ /login
├ ƒ /news/[id]
└ ○ /register
```

Все пять маршрутов собрались, TypeScript прошёл без ошибок, SCSS скомпилировался.

---

## 5. Альтернативы, которые мы рассмотрели (и почему нет)

| Решение | Альтернатива | Почему выбрали так |
|---|---|---|
| **Next.js App Router** | Vite, Next.js Pages Router | Опыт владельца + современный стандарт + Vercel (деплой по ТЗ); TS — сильнее для портфолио |
| **Клиентский режим ('use client')** | SSR/Server Components | У нас отдельный API, SSR не нужен |
| **axios + интерцептор** | fetch с руками на каждом запросе | Один интерцептор — автотокен везде |
| **AuthContext (Context API)** | Redux / Zustand | Проще для учебного проекта; хуки + контекст по ТЗ |
| **SCSS (`@use`)** | styled-components / CSS Modules | По DESIGN.md; переменные общие |

---

## 6. Вопросы для самопроверки

1. Почему мы выбрали Next.js вместо Vite? Что даёт App Router?
2. Что делает директива `'use client'`?
3. Почему в роуте `/news/[id]` сегмент берётся в квадратные скобки?
4. Что делает интерцептор axios и зачем он нам?
5. Почему переменная называется `NEXT_PUBLIC_API_URL`, а не просто `API_URL`?
6. Что хранит AuthContext? Что произойдёт, если токен истёк при восстановлении сессии?
7. Как работает защита маршрута в `/editor`?
8. Зачем отдельный файл `types/api.ts`? Что значит «Type Synchronization»?
9. Как SCSS попадает в приложение Next.js? Что делает `layout.tsx`?
10. Почему токен хранится в `localStorage`, а не в cookie?

---

## 7. Итог

Фронтенд «ожил»: Next.js + TypeScript, авторизация через AuthContext/axios, публичный список новостей, просмотр статьи с рендером всех типов блоков, защищённый каркас редактора. Сборка зелёная. Осталось наполнить редактор блоками (Фаза 7) и добавить колокольчик (Фаза 8).

**Важно:** чтобы фронтенд реально получал данные, в `backend/.env` должен быть валидный `MONGO_URI` из Atlas и запущен `npm run dev` бэкенда.
