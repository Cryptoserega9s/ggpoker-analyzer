const User = require('./User');
// --- НОВОЕ: Импортируем новую модель ---
const PlayedHand = require('./PlayedHand');

// Мы экспортируем все модели в одном объекте для удобства
module.exports = {
    User,
    PlayedHand, // --- И ДОБАВЛЯЕМ ЕЕ В ЭКСПОРТ ---
};