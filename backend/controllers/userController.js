// Импортируем нашу модель User
const { User } = require('../models/models');
// Импортируем bcrypt для хэширования пароля
const bcrypt = require('bcryptjs');
// Импортируем jwt для создания токенов
const jwt = require('jsonwebtoken');

// Функция для генерации JWT токена
const generateJwt = (id, email, role) => {
    return jwt.sign(
        { id, email, role },
        'RANDOM_SECRET_KEY', // Секретный ключ. В реальном проекте его нужно вынести в переменные окружения!
        { expiresIn: '24h' } // Время жизни токена
    );
};

class UserController {
    // Метод для регистрации
    async registration(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: 'Некорректный email или пароль' });
            }
            const candidate = await User.findOne({ where: { email } });
            if (candidate) {
                return res.status(409).json({ message: 'Пользователь с таким email уже существует' });
            }
            const hashPassword = await bcrypt.hash(password, 5);
            const user = await User.create({ email, password_hash: hashPassword });
            const token = generateJwt(user.id, user.email, user.role);
            return res.json({ token });
        } catch (e) {
            console.error(e);
            return res.status(500).json({ message: 'Ошибка при регистрации' });
        }
    }

    // --- НОВЫЙ МЕТОД: ЛОГИН ---
    async login(req, res) {
        try {
            const { email, password } = req.body;
            // Ищем пользователя по email
            const user = await User.findOne({ where: { email } });
            if (!user) {
                // Если пользователь не найден, отправляем общую ошибку, чтобы не подсказывать, что именно неверно (email или пароль)
                return res.status(401).json({ message: 'Указан неверный email или пароль' });
            }
            // Сравниваем пароль, который ввел пользователь, с хэшем в базе
            let comparePassword = bcrypt.compareSync(password, user.password_hash);
            if (!comparePassword) {
                return res.status(401).json({ message: 'Указан неверный email или пароль' });
            }
            // Если все совпало, генерируем новый токен
            const token = generateJwt(user.id, user.email, user.role);
            return res.json({ token });
        } catch (e) {
            console.error(e);
            return res.status(500).json({ message: 'Ошибка при входе' });
        }
    }
}

module.exports = new UserController();