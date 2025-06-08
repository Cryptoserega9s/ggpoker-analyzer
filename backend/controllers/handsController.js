const { PlayedHand } = require('../models/models');
const handParser = require('../services/hand-parser');
// --- НОВОЕ: Импортируем библиотеку для работы с ZIP ---
const JSZip = require('jszip');

class HandsController {
    async upload(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'Файл не был загружен' });
            }
            
            // --- НОВАЯ ЛОГИКА: РАСПАКОВКА ZIP-АРХИВА ---
            console.log('Получен файл, начинаю распаковку...');
            const zip = await JSZip.loadAsync(req.file.buffer);
            let combinedHistory = '';

            // Асинхронно проходим по каждому файлу в архиве
            const promises = [];
            zip.forEach((relativePath, zipEntry) => {
                // Обрабатываем только .txt файлы
                if (zipEntry.name.endsWith('.txt')) {
                    promises.push(
                        zipEntry.async('string').then(content => {
                            combinedHistory += content + '\n';
                        })
                    );
                }
            });
            
            // Дожидаемся, пока все файлы будут прочитаны
            await Promise.all(promises);

            if (combinedHistory.length === 0) {
                return res.status(400).json({ message: 'В архиве не найдено .txt файлов с историей.' });
            }
            // --- КОНЕЦ НОВОЙ ЛОГИКИ ---
            
            // Дальше все как и было: передаем одну большую строку в парсер
            const parsedData = handParser.parseFile(combinedHistory);
            
            if (parsedData.length === 0) {
                return res.status(400).json({ message: 'Не удалось распознать раздачи в файлах.' });
            }

            const dataToSave = parsedData.map(hand => ({
                ...hand,
                userId: req.user.id
            }));

            await PlayedHand.bulkCreate(dataToSave, {
                updateOnDuplicate: ["net_result_bb"] 
            });

            return res.json({ message: `Архив успешно обработан. Добавлено/обновлено ${parsedData.length} раздач.` });

        } catch (e) {
            console.error('Ошибка при загрузке файла:', e);
            return res.status(500).json({ message: 'Ошибка на сервере при обработке файла' });
        }
    }
}

module.exports = new HandsController();