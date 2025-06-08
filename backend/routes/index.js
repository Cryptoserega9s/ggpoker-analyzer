const Router = require('express');
const router = new Router();

const userRouter = require('./userRouter');
// --- НОВОЕ: Импортируем роутер для раздач ---
const handsRouter = require('./handsRouter');

// Все маршруты из userRouter будут доступны по префиксу /user
router.use('/user', userRouter); 
// --- НОВОЕ: Все маршруты из handsRouter будут доступны по префиксу /hands ---
router.use('/hands', handsRouter);

module.exports = router;