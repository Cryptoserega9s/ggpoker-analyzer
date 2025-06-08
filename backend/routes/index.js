const Router = require('express');
const router = new Router();

const userRouter = require('./userRouter');
const handsRouter = require('./handsRouter');
// --- НОВОЕ: Импортируем роутер для аналитики ---
const analyticsRouter = require('./analyticsRouter');

router.use('/user', userRouter);
router.use('/hands', handsRouter);
// --- НОВОЕ: Подключаем роутер аналитики ---
router.use('/analytics', analyticsRouter);

module.exports = router;