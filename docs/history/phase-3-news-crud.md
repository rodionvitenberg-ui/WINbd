# Фаза 3 — News CRUD + отложенная публикация

> **Учебник.** Человеческим языком: как устроена сущность News, почему «отложенная публикация» — это данные, а не таймер, какие были альтернативы и какие команды использовали.

**Дата:** 2026-08-11 · **Время:** Asia/Bishkek (UTC+6)

---

## 1. Что мы сделали и зачем

Реализовали **основную сущность задания** — новостные статьи — со всеми endpoints:

| Метод | Путь | Назначение | Доступ |
|---|---|---|---|
| `GET` | `/api/news` | Список новостей (публичные или свои при `?all=1`) | авторизован |
| `POST` | `/api/news` | Создать новость | авторизован |
| `GET` | `/api/news/:id` | Одна новость по id | автор или опубликована |
| `PUT` | `/api/news/:id` | Обновить новость | только автор |
| `DELETE` | `/api/news/:id` | Удалить новость | только автор |

**Все endpoints защищены middleware'ом `authMiddleware`** — это требование ТЗ: «Авторизованному пользователю доступны endpoints для сущности news».

И главное — **отложенная публикация**: автор задаёт дату-время, и новость «публикуется» автоматически при наступлении этого момента. Без единого таймера.

---

## 2. Ключевые концепции

### 2.1. Модель News — «статья как документ»

В MongoDB статья — это **один документ** со всеми данными:

```js
{
  title: 'Моя новость',
  blocks: [
    { type: 'text', text: 'Привет!', style: 'paragraph' },
    { type: 'image', url: '/uploads/photo.jpg', caption: 'Фото' },
    { type: 'quote', text: 'Цитата', author: 'Кто-то' },
    { type: 'code', code: 'const x = 1;', language: 'js' },
    { type: 'file', url: '/uploads/doc.pdf', name: 'doc.pdf', size: 1234 }
  ],
  author: ObjectId('...'),
  status: 'draft',
  publishAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

Блоки хранятся как **массив объектов** с полем `type`. Схема `blockSchema` с `strict: false` разрешает любые дополнительные поля — это гибкость document-модели: не нужно заранее знать все поля каждого типа блока.

**Альтернатива (SQL):** пришлось бы заводить отдельную таблицу `blocks` с `type` и JSON-колонкой, либо городить кучу nullable-полей. В MongoDB это естественная вложенность.

### 2.2. Отложенная публикация = данные, а не таймер

Это ключевое решение, зафиксированное в ADR `docs/adr/0001-scheduled-publication-as-data.md`:

**Почему НЕ таймер?**
- `setTimeout` / cron **умирают при перезапуске сервера** — запланированная публикация потеряется.
- Несколько инстансов сервера будут конфликтовать.
- Нужна отдельная инфраструктура (очереди, scheduler).

**Как мы решаем:**

1. У новости есть `status: 'draft' | 'published'` и `publishAt: Date`.
2. «Опубликовать сейчас» → `status: 'published'`, `publishAt: now`.
3. «Отложить на 15 августа 12:00» → `status: 'draft'`, `publishAt: 15.08 12:00`.
4. При **чтении** списка применяем фильтр:

```js
{ status: 'published', publishAt: { $lte: new Date() } }
```

Публикация «происходит» в момент запроса — надёжно, переживает рестарты, просто.

### 2.3. Право автора (Authorship)

Новость может редактировать/удалять **только её автор** — пользователь, чей `_id` совпадает с `news.author`:

```js
if (news.author.toString() !== req.user.userId) {
  return res.status(403).json({ message: 'Доступ запрещён: только автор может...' });
}
```

`author` хранится как `ObjectId` со ссылкой на коллекцию `users` — `ref: 'User'`.

### 2.4. Пагинация

```js
const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
const skip = (page - 1) * limit;
```

Защита: `page` не меньше 1, `limit` не больше 50.

### 2.5. Публичный список vs «свои черновики»

`GET /api/news?all=1` — автор видит **все свои** новости (черновики + опубликованные). Без параметра — **только опубликованные** с наступившей датой. Так автор управляет черновиками, а читатели видят только готовое.

---

## 3. Файлы фазы

```
backend/src/
├── models/
│   └── News.js                   # схема новости + blockSchema
├── controllers/
│   └── news.controller.js        # createNews, getNews, getNewsById, updateNews, deleteNews
├── routes/
│   └── news.routes.js            # все маршруты под authMiddleware
└── app.js                        # app.use('/api/news', newsRoutes)
```

---

## 4. Использованные команды (журнал)

```bash
# Создание файлов — через MCP filesystem (write_file)
# Проверка без БД (валидация + middleware работают до обращений к базе):
cd backend && node -e "..."
```

Результат проверки:

```
GET /api/news без токена: 401 {"message":"Доступ запрещён: токен не передан"}
POST /api/news без токена: 401
POST /api/news c битым токеном: 401
GET /api/news/bad-id: 401
```

Middleware авторизации работает для всех news-endpoints.

**Полный цикл после подключения Atlas:**

```bash
# регистрация → получаем token
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" \
  -d '{"email":"author@example.com","password":"secret123"}'
# → { "user": {...}, "token": "eyJ..." }

# создать новость (опубликовать сразу)
curl -X POST http://localhost:5000/api/news \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"title":"Моя статья","publishNow":true,"blocks":[{"type":"text","text":"Привет!","style":"paragraph"}]}'
# → 201, news со status: 'published'

# отложенная публикация: статья появится через 1 час
curl -X POST http://localhost:5000/api/news \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"title":"Позже","publishAt":"2026-08-11T05:30:00.000Z"}'
# → 201, news со status: 'draft' и publishAt в будущем

# список своих (черновики + опубликованные)
curl http://localhost:5000/api/news?all=1 -H "Authorization: Bearer <TOKEN>"
```

---

## 5. Альтернативы, которые мы рассмотрели (и почему нет)

| Решение | Альтернатива | Почему выбрали так |
|---|---|---|
| **Отложенная публикация = фильтр** | `setTimeout` / cron / очередь | Таймеры умирают при рестарте, конфликтуют при масштабировании (см. ADR 0001) |
| **Массив блоков в документе** | Отдельная коллекция blocks (SQL-стиль) | Естественная вложенность MongoDB, гибкость |
| **`router.use(authMiddleware)`** | Навешивать middleware на каждый маршрут руками | Одна строка — защита всех endpoints, меньше шансов забыть |
| **Пагинация page/limit** | Отдавать всё сразу | Растущий список новостей, защита от тяжёлых ответов |
| **Публичный список vs `?all=1`** | Два разных роута (/news, /my-news) | Один роут, поведение через query-параметр — проще фронтенд |

---

## 6. Вопросы для самопроверки

1. Почему отложенная публикация — это данные, а не таймер? Что произошло бы с таймером при перезапуске сервера?
2. Что означает фильтр `{ status: 'published', publishAt: { $lte: new Date() } }`?
3. Как связано поле `author` в News с моделью User? Что такое `ref: 'User'`?
4. Как проверить, что новость может редактировать только автор?
5. Что делает `router.use(authMiddleware)`?
6. Зачем нужна пагинация? Что защищают `Math.max`/`Math.min`?
7. Чем отличаются `GET /api/news` и `GET /api/news?all=1`?
8. Что вернёт `POST /api/news` с `publishAt` в будущем? (статус?)
9. Что вернёт `GET /api/news/:id` не-автору для черновика?
10. Почему блоки могут иметь разные поля, и как этому помогает `strict: false`?

---

## 7. Итог

Сущность `News` полностью реализована: CRUD, право автора, отложенная публикация без таймеров, пагинация, защита middleware. После подключения MongoDB Atlas можно гонять полные curl-сценарии из раздела 4.

Дальше — **Фаза 4: загрузка файлов и статика** (multer, express.static).
