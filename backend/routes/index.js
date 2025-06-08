const Router = require('express');
const router = new Router();

// Импортируем роутер для пользователей
const userRouter = require('./userRouter');
// В будущем здесь будут другие: const handsRouter = require('./handsRouter');

// Сопоставляем маршруты с их роутерами
// Все маршруты из userRouter будут доступны по префиксу /user
router.use('/user', userRouter); 
// router.use('/hands', handsRouter);

module.exports = router;