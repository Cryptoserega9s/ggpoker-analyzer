const fs = require('fs');
const path = require('path');
const handParser = require('./services/hand-parser');

// Читаем содержимое обоих файлов и объединяем их
const file1Content = fs.readFileSync(path.join(__dirname, 'GG20250409-1842 - 11 - 0.4 - 0.8 - 9max.txt'), 'utf-8');
const file2Content = fs.readFileSync(path.join(__dirname, 'GG20250421-2045 - 8484 - 0.05 - 0.1 - 5max.txt'), 'utf-8');

const combinedHistory = file1Content + '\n' + file2Content;

console.log('--- Запуск тестового парсера ---');
const result = handParser.parseFile(combinedHistory);
// Выводим только первые 5 и последние 5 результатов для краткости
console.log('--- Первые 5 результатов ---');
console.dir(result.slice(0, 5), { depth: null });
console.log('--- Последние 5 результатов ---');
console.dir(result.slice(-5), { depth: null });
console.log(`--- Всего обработано: ${result.length} раздач ---`);
console.log('--- Тестовый парсер завершен ---');