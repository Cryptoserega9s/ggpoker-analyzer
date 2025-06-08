// Импортируем наш экземпляр sequelize для подключения к БД
const sequelize = require('../db');
// Импортируем DataTypes для описания типов полей (STRING, INTEGER, etc.)
const { DataTypes } = require('sequelize');

// Описываем модель User
const User = sequelize.define('user', {
    // Поле ID. Будет целым числом, первичным ключом и будет авто-инкрементироваться
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    // Поле email. Будет строкой, уникальным (не может быть двух одинаковых email) и обязательным
    email: {type: DataTypes.STRING, unique: true, allowNull: false},
    // Поле для хэша пароля. Будет строкой и обязательным. 
    // Мы НИКОГДА не храним пароли в открытом виде, только их хэш.
    password_hash: {type: DataTypes.STRING, allowNull: false},
    // Поле роли. По умолчанию 'user'. Может быть 'admin'.
    role: {type: DataTypes.STRING, defaultValue: "USER"},
});

// Экспортируем модель, чтобы ее можно было использовать в других файлах
module.exports = User;