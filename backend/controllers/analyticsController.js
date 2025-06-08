const { PlayedHand } = require('../models/models');
const { fn, col, literal } = require('sequelize');

class AnalyticsController {
    async getMainStats(req, res) {
        try {
            const userId = req.user.id; // Получаем ID пользователя из токена

            // Sequelize магия для подсчета статистики
            const stats = await PlayedHand.findOne({
                where: { userId },
                attributes: [
                    // Считаем VPIP: (количество рук с vpip=true / общее количество рук) * 100
                    [literal(`(COUNT(CASE WHEN "hero_vpip" = true THEN 1 END) * 100.0 / COUNT(*))`), 'vpip'],
                    // Считаем PFR: (количество рук с pfr=true / общее количество рук) * 100
                    [literal(`(COUNT(CASE WHEN "hero_pfr" = true THEN 1 END) * 100.0 / COUNT(*))`), 'pfr'],
                    // Просто считаем общее количество рук
                    [fn('COUNT', col('hand_id')), 'totalHands'],
                ],
                raw: true // Важно, чтобы получить простой JSON-объект
            });

            if (!stats || stats.totalHands === 0) {
                return res.json({ vpip: 0, pfr: 0, totalHands: 0 });
            }

            // Округляем значения до одного знака после запятой
            const result = {
                vpip: parseFloat(stats.vpip).toFixed(1),
                pfr: parseFloat(stats.pfr).toFixed(1),
                totalHands: stats.totalHands,
            };

            return res.json(result);

        } catch (e) {
            console.error("Ошибка при подсчете основной статистики:", e);
            return res.status(500).json({ message: 'Ошибка на сервере при подсчете статистики' });
        }
    }
}

module.exports = new AnalyticsController();