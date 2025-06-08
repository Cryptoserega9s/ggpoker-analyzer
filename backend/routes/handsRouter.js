const Router = require('express');
const router = new Router();
const handsController = require('../controllers/handsController');
const authMiddleware = require('../middleware/authMiddleware');

// Middleware для обработки файлов
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }); // Храним файл в памяти

// Защищаем роут с помощью authMiddleware.
// `upload.single('file')` - говорим multer, что мы ожидаем один файл в поле 'file'.
router.post('/upload', authMiddleware, upload.single('file'), handsController.upload);

module.exports = router;