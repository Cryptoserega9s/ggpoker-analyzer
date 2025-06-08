const User = require('./User');
// В будущем здесь будут другие модели: const PlayedHand = require('./PlayedHand') и т.д.

// Мы экспортируем все модели в одном объекте для удобства
module.exports = {
    User,
    // PlayedHand,
};