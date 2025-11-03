const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const { errorResponse } = require('./middlewares/errorFormatter');

const app = express();
app.use(cors());
app.use(express.json());

// Проверка здоровья (для Render или CI smoke test)
app.get('/health', (_, res) => res.json({ status: 'ok', service: 'SmartProducts' }));

// Основные маршруты API
app.use('/api/products', productRoutes);

// 404 — если маршрут не найден
app.use((req, res) => errorResponse(res, 404, 'Not Found'));

// Запуск сервера
const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`✅ Backend działa na porcie ${PORT}`));
}

module.exports = app;
