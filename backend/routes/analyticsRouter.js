const Router = require('express');
const router = new Router();
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');

// Старый роут
router.get('/main-stats', authMiddleware, analyticsController.getMainStats);
// --- НОВЫЙ РОУТ ---
router.get('/filtered-stats', authMiddleware, analyticsController.getFilteredStats);

module.exports = router;