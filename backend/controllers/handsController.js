const { PlayedHand } = require('../models/models');
const handParser = require('../services/hand-parser');

class HandsController {
    async upload(req, res) {
        try {
            // req.file создается библиотекой multer
            if (!req.file) {
                return res.status(400).json({ message: 'Файл не был загружен' });
            }
            
            // Получаем содержимое файла в виде строки
            const fileContent = req.file.buffer.toString('utf-8');
            
            // Используем наш готовый парсер
            const parsedData = handParser.parseFile(fileContent);
            
            // Добавляем userId к каждой раздаче
            const dataToSave = parsedData.map(hand => ({
                ...hand,
                userId: req.user.id // req.user добавляется в authMiddleware
            }));

            // Сохраняем все раздачи в базу ОДНИМ запросом.
            // bulkCreate - очень эффективный метод для массовой вставки.
            // updateOnDuplicate - указывает, какие поля обновлять, если такая раздача уже есть.
            await PlayedHand.bulkCreate(dataToSave, {
                updateOnDuplicate: ["net_result_bb"] // Пример, можно указать другие поля
            });

            return res.json({ message: `Файл успешно обработан. Добавлено/обновлено ${parsedData.length} раздач.` });

        } catch (e) {
            console.error('Ошибка при загрузке файла:', e);
            return res.status(500).json({ message: 'Ошибка на сервере при обработке файла' });
        }
    }
}

module.exports = new HandsController();