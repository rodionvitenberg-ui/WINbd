# Фаза 4 — Загрузка файлов и статика

> **Учебник.** Человеческим языком: как устроена загрузка файлов в Node.js, что такое multipart/form-data и multer, зачем загрузка — отдельный endpoint, и почему случайный файл «отвалился» с 400 — это правильно.

**Дата:** 2026-08-11 · **Время:** Asia/Bishkek (UTC+6)

---

## 1. Что мы сделали и зачем

ТЗ: «Будет возможность загружать файлы с клиента и затем раздавать статику». Мы реализовали:

| Что | Как | Зачем |
|---|---|---|
| **Загрузка** | `POST /api/upload` (multer) | Клиент шлёт файл, сервер сохраняет в `uploads/` |
| **Раздача статики** | `express.static('/uploads')` | Браузер может открыть файл по URL `/uploads/xxx.png` |

Файлы раздаются **публично** по URL — именно это нужно редактору: статья ссылается на `/uploads/photo.jpg`, и любой читатель может её открыть.

---

## 2. Ключевые концепции

### 2.1. Почему загрузка файлов — это НЕ JSON?

Пока мы отправляли на сервер только JSON: `{ "title": "...", "blocks": [...] }`. Файл — это **бинарные данные** + метаданные (имя, тип). Чтобы передать и файл, и поля формы в одном запросе, используется формат **multipart/form-data**:

```
POST /api/upload
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryXYZ

------WebKitFormBoundaryXYZ
Content-Disposition: form-data; name="file"; filename="photo.jpg"
Content-Type: image/jpeg

<бинарные данные фото>
------WebKitFormBoundaryXYZ--
```

Каждая «секция» — одно поле формы. Поле `file` содержит сам файл. Express **не умеет** парсить multipart сам (`express.json()` — только JSON), поэтому нужен **multer**.

### 2.2. Multer — парсер multipart/form-data

**Multer** — стандартная библиотека для загрузки файлов в Express. Он:

1. Разбирает multipart-запрос (используя движок busboy).
2. Сохраняет файл на диск (или в память).
3. Кладёт информацию о файле в `req.file`.

В нашем `config/upload.js`:

- `storage: multer.diskStorage(...)` — сохранять на диск в `uploads/`;
- `filename` — уникальное имя `(<timestamp>-<random>.<ext>)`, чтобы файлы с одинаковыми именами не перезаписывали друг друга;
- `fileFilter` — разрешённые MIME-типы (картинки, PDF, doc/docx);
- `limits.fileSize` — максимум 5 МБ.

`multer` используется как **middleware** в маршруте: `upload.single('file')` — «прими один файл из поля file».

### 2.3. MIME-типы — «паспорт» файла

**MIME-тип** (Media Type) — строка, описывающая формат данных: `image/jpeg`, `application/pdf`, `text/plain`. Браузер, отправляя файл, указывает его MIME на основе расширения. Мы фильтруем по ним:

```js
const allowed = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', ...];
if (allowed.includes(file.mimetype)) callback(null, true); // принять
else { /* error.status = 400; callback(error, false) */ }
```

Почему фильтр? Серверу нельзя доверять клиенту полностью: кто-то может попытаться загрузить исполняемый файл. Ограничение типов и размера — базовая защита.

### 2.4. Централизованный обработчик ошибок

До этой фазы ошибки (например, «тип не поддерживается») падали в консоль голым стеком. Мы добавили **error handler**: middleware Express с 4 параметрами `(err, req, res, next)`, который перехватывает ошибки, переданные в `next(error)` (multer так и делает), и отвечает аккуратно:

```js
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Ошибка сервера' });
});
```

Multer кладёт в ошибку `status` (например, 400 для fileFilter, `LIMIT_FILE_SIZE` для размера) — мы уважаем его, иначе 500.

### 2.5. Раздача статики: express.static

```js
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
```

- `express.static` — встроенный middleware Express: отдаёт файлы из папки как статику.
- `app.use('/uploads', ...)` — URL начинаются с `/uploads/`, файл берётся из `uploads/`.
- `path.join(__dirname, '..', 'uploads')` — абсолютный путь к папке (не зависит от того, откуда запущен процесс).

Благодаря этому любой запрос `GET /uploads/1786...png` вернёт содержимое файла — и браузер сможет его отобразить.

---

## 3. Файлы фазы

```
backend/src/
├── config/
│   └── upload.js                 # multer: storage, fileFilter, limits
├── controllers/
│   └── upload.controller.js      # формирует ответ с url файла
├── routes/
│   └── upload.routes.js          # POST /api/upload (authMiddleware + upload.single)
└── app.js                        # /api/upload + /uploads static + error handler
```

---

## 4. Использованные команды (журнал)

```bash
# Установка multer
cd backend && npm install multer

# Тест через node (запись результата в файл для надёжного чтения)
cd backend && node -e "..."
```

Результат теста (прочитан через filesystem):

```
upload без токена: 401 {"message":"Доступ запрещён: токен не передан"}
upload неразрешённый тип: 400 {"message":"Тип файла не поддерживается: application/octet-stream"}
upload image/png: 201 {"url":"/uploads/1786...png","name":"photo.png","size":4,"mimetype":"image/png"}
GET статики /uploads/1786...png: 200 PNG␍␊
health: 200 {"status":"ok",...}
```

**Что показал тест:**
- без токена — middleware отсекает (401) ✔;
- неразрешённый тип — error handler отвечает 400 (не голый стек!) ✔;
- разрешённый PNG — 201 + url ✔;
- GET по этому url — 200 + реальные байты PNG (раздача статики) ✔.

> Причина «неразрешённый тип» у test.txt: браузер/Blob назначил `application/octet-stream` (общий бинарный тип), а в нашем белом списке только картинки/PDF/doc. Это **правильное** поведение защиты, а не баг.

---

## 5. Альтернативы, которые мы рассмотрели (и почему нет)

| Решение | Альтернатива | Почему выбрали так |
|---|---|---|
| **Сохранение на диск (diskStorage)** | В память (memoryStorage) / облако (S3) | Для учебного проекта и раздачи статики — диск проще; S3 — на фазе деплоя |
| **Уникальные имена файлов** | Оставлять исходное имя | Коллизии: два photo.jpg перезапишут друг друга; уникальное имя безопаснее |
| **Фильтр MIME + лимит 5 МБ** | Принимать всё | Базовая защита от мусора и перегрузки |
| **Отдельный endpoint /api/upload** | Встраивать файлы в JSON новости | multipart и JSON несовместимы; отдельный endpoint — стандарт |
| **Публичная раздача (/uploads без auth)** | Закрыть авторизацией | Статья ссылается на файл — читателю нужен публичный доступ |

---

## 6. Вопросы для самопроверки

1. Что такое multipart/form-data и почему JSON для файлов не подходит?
2. Что делает multer и как он связан с `req.file`?
3. Почему имя файла на диске не совпадает с исходным?
4. Что такое MIME-тип? Какой тип у JPG? у PDF?
5. Зачем нужен fileFilter и limits.fileSize?
6. Почему error handler Express обязан иметь 4 параметра?
7. Что делает `express.static` и как URL `/uploads/x.png` связан с файлом на диске?
8. Почему `path.join(__dirname, '..', 'uploads')` лучше, чем просто `'uploads'`?
9. Что вернёт сервер, если загрузить `script.exe`? (подумай о fileFilter)
10. Зачем статика публична, если новости могут быть черновиками?

---

## 7. Итог

Загрузка файлов и раздача статики работают: 401 для неавторизованных, 400 для неверных типов (аккуратный JSON через error handler), 201 + url для успеха, 200 при раздаче файла читателю. Осталось подключить реальный `MONGO_URI` — и фронтенд сможет загружать картинки/файлы в новости.

Дальше — **Фаза 5: real-time уведомления (Socket.io)**.
