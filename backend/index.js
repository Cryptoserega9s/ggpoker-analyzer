// --- 1. ИМПОРТЫ ---
const express = require('express');
const cors = require('cors');
const sequelize = require('./db');
const models = require('./models/models'); // Импортируем все модели
// --- НОВОЕ: Импортируем главный роутер ---
const router = require('./routes/index');

// --- 2. ИНИЦИАЛИЗАЦИЯ ---
const PORT = 5000;
const app = express();

// --- 3. MIDDLEWARE (Промежуточное ПО) ---
app.use(cors());
app.use(express.json());
// --- НОВОЕ: Подключаем роутер. Все запросы будут проходить через него ---
// Все URL, определенные в нашем роутере, теперь будут начинаться с /api
app.use('/api', router);

// --- 4. ЗАПУСК СЕРВЕРА --- (секция 4 была переименована, т.к. роуты теперь в отдельном файле)
const start = async () => {
    try {
        await sequelize.authenticate();
        console.log('Соединение с БД было успешно установлено');

        await sequelize.sync();
        console.log('Модели были успешно синхронизированы');
        
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

    } catch (e) {
        console.log('Произошла ошибка при запуске', e);
    }
};

// Вызываем функцию запуска
start();