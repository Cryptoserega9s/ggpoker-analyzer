const Router = require('express');
const router = new Router();
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');

// Защищаем роут, чтобы каждый пользователь видел только свою статистику
router.get('/main-stats', authMiddleware, analyticsController.getMainStats);

module.exports = router;