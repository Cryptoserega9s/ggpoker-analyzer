const { PlayedHand } = require('../models/models');
const { fn, col, literal, Op } = require('sequelize');

class AnalyticsController {
    // Старый метод оставляем, он может пригодиться
    async getMainStats(req, res) {
        // ... (код без изменений)
    }

    // --- НОВЫЙ СУПЕР-МЕТОД ---
    async getFilteredStats(req, res) {
        try {
            const userId = req.user.id;
            // Получаем фильтры из строки запроса (req.query)
            const { position, stackFrom, stackTo } = req.query;

            // --- 1. Формируем динамическое условие WHERE ---
            const whereClause = { userId };
            if (position) {
                whereClause.hero_position = position;
            }
            if (stackFrom && stackTo) {
                whereClause.hero_stack_in_bb = {
                    [Op.between]: [parseFloat(stackFrom), parseFloat(stackTo)]
                };
            }
            // Здесь в будущем можно добавить другие фильтры: players_at_table, preflop_action и т.д.

            // --- 2. Выполняем ДВА запроса параллельно для скорости ---
            const [generalStats, handMatrixStats] = await Promise.all([
                // Запрос 1: Считаем общие статы (VPIP, PFR, 3-bet и т.д.)
                PlayedHand.findOne({
                    where: whereClause,
                    attributes: [
                        [literal(`(COUNT(CASE WHEN "hero_vpip" = true THEN 1 END) * 100.0 / COUNT(*))`), 'vpip'],
                        [literal(`(COUNT(CASE WHEN "hero_pfr" = true THEN 1 END) * 100.0 / COUNT(*))`), 'pfr'],
                        [literal(`(COUNT(CASE WHEN "hero_made_3bet" = true THEN 1 END) * 100.0 / COUNT(CASE WHEN "hero_faced_3bet" = true OR "hero_made_3bet" = true THEN 1 END))`), 'three_bet'],
                        [fn('COUNT', col('hand_id')), 'totalHands'],
                    ],
                    raw: true,
                }),
                // Запрос 2: Считаем статистику для каждой отдельной руки (для матрицы)
                PlayedHand.findAll({
                    where: whereClause,
                    attributes: [
                        'starting_hand',
                        // Суммируем профит в ББ для каждой руки
                        [fn('SUM', col('net_result_bb')), 'totalProfitBb'],
                        // Считаем количество раз, когда мы играли эту руку
                        [fn('COUNT', col('hand_id')), 'handCount'],
                    ],
                    group: ['starting_hand'], // Группируем по стартовой руке
                    raw: true,
                })
            ]);

            // --- 3. Форматируем и отправляем результат ---
            const result = {
                generalStats: {
                    vpip: parseFloat(generalStats?.vpip || 0).toFixed(1),
                    pfr: parseFloat(generalStats?.pfr || 0).toFixed(1),
                    three_bet: parseFloat(generalStats?.three_bet || 0).toFixed(1),
                    totalHands: generalStats?.totalHands || 0,
                },
                handMatrixStats: handMatrixStats.map(hand => ({
                    hand: hand.starting_hand,
                    profit: parseFloat(hand.totalProfitBb),
                    count: parseInt(hand.handCount, 10),
                })),
            };

            return res.json(result);

        } catch (e) {
            console.error("Ошибка при подсчете фильтрованной статистики:", e);
            return res.status(500).json({ message: 'Ошибка на сервере при подсчете статистики' });
        }
    }
}

module.exports = new AnalyticsController();