const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');

// При POST-запросе на /user/registration будет вызываться метод registration
router.post('/registration', userController.registration);

// --- НОВЫЙ МАРШРУТ: ЛОГИН ---
// При POST-запросе на /user/login будет вызываться метод login
router.post('/login', userController.login);

module.exports = router;