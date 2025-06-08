const fs = require('fs');
const path = require('path');
const handParser = require('./services/hand-parser');

const file1 = fs.readFileSync(path.join(__dirname, 'GG20250409-1842 - 11 - 0.4 - 0.8 - 9max.txt'), 'utf-8');
const file2 = fs.readFileSync(path.join(__dirname, 'GG20250421-2045 - 8484 - 0.05 - 0.1 - 5max.txt'), 'utf-8');
const file3 = fs.readFileSync(path.join(__dirname, 'GG20250525-0612 - 11 - 0.4 - 0.8 - 9max.txt'), 'utf-8');

const combinedHistory = file1 + '\n' + file2 + '\n' + file3;

console.log('--- Запуск тестового парсера ---');
const result = handParser.parseFile(combinedHistory);

console.dir(result.slice(0, 5), { depth: null });
console.dir(result.slice(-5), { depth: null });
console.log(`--- Всего обработано: ${result.length} раздач ---`);
console.log('--- Тестовый парсер завершен ---');