const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const PlayedHand = sequelize.define('played_hand', {
    // --- Ключи ---
    // user_id будет добавлен автоматически через ассоциацию
    tournament_id: { type: DataTypes.BIGINT, primaryKey: true },
    hand_id: { type: DataTypes.STRING, primaryKey: true },

    // --- Контекст раздачи ---
    played_at: { type: DataTypes.DATE, allowNull: false },
    big_blind_size: { type: DataTypes.INTEGER, allowNull: false },
    hero_position: { type: DataTypes.STRING(10), allowNull: false },
    starting_hand: { type: DataTypes.STRING(4), allowNull: false },
    hero_stack_in_bb: { type: DataTypes.DECIMAL(8, 2), allowNull: false },
    players_at_table: { type: DataTypes.INTEGER, allowNull: false },
    is_final_table: { type: DataTypes.BOOLEAN, defaultValue: false },

    // --- Флаги префлоп-действий ---
    hero_vpip: { type: DataTypes.BOOLEAN, allowNull: false },
    hero_pfr: { type: DataTypes.BOOLEAN, allowNull: false },
    hero_limped: { type: DataTypes.BOOLEAN, allowNull: false },
    hero_cold_called: { type: DataTypes.BOOLEAN, allowNull: false },
    hero_made_3bet: { type: DataTypes.BOOLEAN, allowNull: false },
    hero_faced_3bet: { type: DataTypes.BOOLEAN, allowNull: false },
    hero_called_3bet: { type: DataTypes.BOOLEAN, allowNull: false },
    hero_folded_to_3bet: { type: DataTypes.BOOLEAN, allowNull: false },
    hero_made_4bet: { type: DataTypes.BOOLEAN, allowNull: false },
    hero_made_squeeze: { type: DataTypes.BOOLEAN, allowNull: false },
    hero_attempted_steal: { type: DataTypes.BOOLEAN, allowNull: false },
    
    // --- Флаги постфлоп-действий ---
    saw_flop: { type: DataTypes.BOOLEAN, allowNull: false },
    saw_turn: { type: DataTypes.BOOLEAN, allowNull: false },
    saw_river: { type: DataTypes.BOOLEAN, allowNull: false },
    
    // --- Флаги исхода раздачи ---
    went_to_showdown: { type: DataTypes.BOOLEAN, allowNull: false },
    won_hand: { type: DataTypes.BOOLEAN, allowNull: false },
    net_result_bb: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
});

module.exports = PlayedHand;