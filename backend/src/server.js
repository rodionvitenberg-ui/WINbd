/**
 * Файл: server.js — ТОЧКА ВХОДА приложения.
 *
 * Порядок выполнения (сверху вниз) критичен:
 * 1. Подключаем dotenv ПЕРВЫМ, чтобы process.env уже содержал
 *    переменные из .env к моменту, когда их прочитает app.js / db.js.
 * 2. Создаём Express-приложение (createApp).
 * 3. Подключаемся к MongoDB.
 * 4. Запускаем HTTP-сервер (app.listen).
 */

// 1. dotenv читает файл .env и кладёт его содержимое в process.env.
require('dotenv').config();

const createApp = require('./app');
const connectDB = require('./config/db');

/**
 * Стартует сервер: подключается к БД и начинает слушать порт.
 */
async function startServer() {
  // 2. Собираем приложение (middleware + маршруты) из app.js.
  const app = createApp();

  // 3. Подключаемся к MongoDB Atlas. Если не получится — функция завершит
  //    процесс кодом 1, и до listen мы просто не дойдём.
  await connectDB();

  // 4. Порт берём из .env (по умолчанию 5000).
  const PORT = process.env.PORT || 5000;

  // app.listen — запускает HTTP-сервер на указанном порту.
  // Колбэк вызывается, когда сервер реально начал слушать порт.
  app.listen(PORT, () => {
    console.log(`API сервер запущен: http://localhost:${PORT}`);
  });
}

// Запускаем только если файл выполняется напрямую (node src/server.js),
// а не импортируется (такое нам понадобится для тестов — импортируем app, не server).
startServer();

module.exports = { startServer };