const express = require('express');
const cors = require('cors');
const sequelize = require('./db');
// --- ИЗМЕНЕНО: Импортируем модели по-новому ---
const { User, PlayedHand } = require('./models/models'); 
const router = require('./routes/index');

const PORT = 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', router);

const start = async () => {
    try {
        await sequelize.authenticate();
        console.log('Соединение с БД было успешно установлено');

        // --- НОВОЕ: Настраиваем ассоциации ---
        // Это говорит Sequelize: "У одного User много PlayedHand".
        // И автоматически добавит поле `userId` в таблицу played_hands.
        User.hasMany(PlayedHand);
        PlayedHand.belongsTo(User);

        await sequelize.sync();
        console.log('Модели были успешно синхронизированы');
        
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

    } catch (e) {
        console.log('Произошла ошибка при запуске', e);
    }
};

start();