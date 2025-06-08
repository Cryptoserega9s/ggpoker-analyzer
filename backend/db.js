// Импортируем класс Sequelize из установленной библиотеки
const { Sequelize } = require('sequelize');

// Создаем новый экземпляр Sequelize и передаем ему параметры для подключения.
// Это основной объект, через который мы будем взаимодействовать с БД.
module.exports = new Sequelize(
    'ggpoker_analyzer', // 1. Название базы данных
    'postgres',         // 2. Имя пользователя
    'root',             // 3. Пароль от базы данных
    {
        dialect: 'postgres',    // Явно указываем, что мы работаем с PostgreSQL
        host: 'localhost',      // Адрес, где находится наша БД
        port: '5432'            // Стандартный порт для PostgreSQL
    }
);