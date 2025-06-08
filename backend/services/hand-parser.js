// ... (POSITION_MAP остается без изменений) ...
const POSITION_MAP = {
    9: ['UTG', 'UTG+1', 'MP', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB'],
    8: ['UTG', 'UTG+1', 'MP', 'HJ', 'CO', 'BTN', 'SB', 'BB'],
    7: ['UTG', 'MP', 'HJ', 'CO', 'BTN', 'SB', 'BB'],
    6: ['UTG', 'MP', 'CO', 'BTN', 'SB', 'BB'],
    5: ['BTN', 'SB', 'BB', 'UTG', 'CO'].reverse(),
    4: ['BTN', 'SB', 'BB', 'UTG'].reverse(),
    3: ['BTN', 'SB', 'BB'],
    2: ['SB', 'BB'],
};


class HandParser {
    parseFile(fileContent) {
        const handHistories = fileContent.split('Poker Hand #').slice(1);
        const parsedHands = [];

        for (const historyText of handHistories) {
            const singleHandData = this._parseSingleHand('Poker Hand #' + historyText);
            if (singleHandData) {
                parsedHands.push(singleHandData);
            }
        }
        return parsedHands;
    }

    _parseSingleHand(handText) {
        // --- 1. БАЗОВАЯ ИНФОРМАЦИЯ ---
        const handInfoMatch = handText.match(/Poker Hand #(?<handId>.*?):.*?Tournament #(?<tournamentId>\d+)?/);
        const dateTimeMatch = handText.match(/\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}/);
        
        // --- НОВАЯ ЛОГИКА: БЛАЙНДЫ И СТАДИЯ ТУРНИРА ---
        const blindsMatch = handText.match(/Level\d+\((?<sb>\d+)\/(?<bb>\d+)\)/);
        const isFinalTable = handText.includes('9-max');

        if (!handInfoMatch || !dateTimeMatch || !blindsMatch) return null;

        const handId = handInfoMatch.groups.handId;
        const tournamentId = handInfoMatch.groups.tournamentId || null;
        const playedAt = new Date(dateTimeMatch[0]);
        const bigBlindSize = parseInt(blindsMatch.groups.bb, 10);
        
        // --- 2. ИНФОРМАЦИЯ О ГЕРОЕ ---
        const heroCardsMatch = handText.match(/Dealt to Hero \[(?<cards>.*?)\]/);
        if (!heroCardsMatch) return null;

        const tableSetupBlock = handText.split('*** HOLE CARDS ***')[0];
        const playerSeatMatches = [...tableSetupBlock.matchAll(/Seat (?<seatNumber>\d+): .*? \(/g)];
        const playersCount = playerSeatMatches.length;
        if (playersCount === 0) return null;
        
        const heroSeatMatch = tableSetupBlock.match(/Seat \d+: Hero \((?<stack>[\d,]+) in chips\)/);
        if (!heroSeatMatch) return null;
        const heroStackInChips = parseInt(heroSeatMatch.groups.stack.replace(/,/g, ''), 10);
        // Считаем стек в больших блайндах
        const heroStackInBB = parseFloat((heroStackInChips / bigBlindSize).toFixed(2));

        const heroSeatNumber = parseInt(tableSetupBlock.match(/Seat (?<seatNumber>\d+): Hero/)[1], 10);
        const buttonSeatNumber = parseInt(tableSetupBlock.match(/Seat #(?<seatNumber>\d+) is the button/)[1], 10);
        const activeSeats = playerSeatMatches.map(m => parseInt(m.groups.seatNumber));
        
        const heroPosition = this._getPlayerPosition(heroSeatNumber, buttonSeatNumber, activeSeats);
        const rawCards = heroCardsMatch.groups.cards.split(' ');
        const startingHand = this._normalizeHand(rawCards[0], rawCards[1]);
        
        // --- 3. АНАЛИЗ ДЕЙСТВИЙ ---
        const actionsBlock = handText.split('*** HOLE CARDS ***')[1].split('*** FLOP ***')[0];
        const preflopActions = this._getPreflopActions(actionsBlock, 'Hero');

        // --- 4. СБОРКА РЕЗУЛЬТАТА ---
        const parsedData = {
            hand_id: handId,
            tournament_id: tournamentId,
            played_at: playedAt,
            is_final_table: isFinalTable, // Флаг финального стола
            big_blind_size: bigBlindSize, // Размер ББ
            hero_position: heroPosition,
            starting_hand: startingHand,
            players_at_table: playersCount,
            hero_stack_in_chips: heroStackInChips, // Стек в фишках
            hero_stack_in_bb: heroStackInBB, // Стек в ББ
            hero_vpip: preflopActions.vpip,
            hero_pfr: preflopActions.pfr,
        };
        return parsedData;
    }

    _getPlayerPosition(playerSeat, buttonSeat, activeSeats) {
        // ... (этот метод остается без изменений) ...
        const playersCount = activeSeats.length;
        if (!POSITION_MAP[playersCount]) return 'UNKNOWN';
        if (playersCount === 2) return playerSeat === buttonSeat ? 'SB' : 'BB';
        const sortedSeats = [...activeSeats].sort((a, b) => a - b);
        const buttonIndex = sortedSeats.indexOf(buttonSeat);
        const playerIndex = sortedSeats.indexOf(playerSeat);
        const relativeIndex = (playerIndex - buttonIndex + playersCount) % playersCount;
        const offsetMap = {
            9: ['BTN', 'SB', 'BB', 'UTG', 'UTG+1', 'MP', 'LJ', 'HJ', 'CO'],
            8: ['BTN', 'SB', 'BB', 'UTG', 'UTG+1', 'MP', 'HJ', 'CO'],
            7: ['BTN', 'SB', 'BB', 'UTG', 'MP', 'HJ', 'CO'],
            6: ['BTN', 'SB', 'BB', 'UTG', 'MP', 'CO'],
            5: ['BTN', 'SB', 'BB', 'UTG', 'CO'],
            4: ['BTN', 'SB', 'BB', 'UTG'],
            3: ['BTN', 'SB', 'BB'],
        };
        const currentOffsetMap = offsetMap[playersCount];
        return currentOffsetMap ? currentOffsetMap[relativeIndex] : 'UNKNOWN';
    }
    
    _normalizeHand(card1, card2) {
        // ... (этот метод остается без изменений) ...
        const ranks = 'AKQJT98765432';
        const r1 = card1.charAt(0);
        const r2 = card2.charAt(0);
        const s1 = card1.charAt(1);
        const s2 = card2.charAt(1);
        const suited = s1 === s2 ? 's' : 'o';
        if (r1 === r2) return r1 + r2;
        return ranks.indexOf(r1) < ranks.indexOf(r2) ? r1 + r2 + suited : r2 + r1 + suited;
    }

    _getPreflopActions(actionsBlock, heroName) {
        // ... (этот метод остается без изменений) ...
        const actions = actionsBlock.trim().split('\n').map(a => a.trim());
        let vpip = false;
        let pfr = false;
        let firstActionDone = false;
        for (const action of actions) {
            if (action.startsWith(heroName)) {
                if (!firstActionDone) {
                    if (action.includes('raises')) pfr = true;
                    firstActionDone = true;
                }
                if (action.includes('raises') || action.includes('calls') || action.includes('bets')) vpip = true;
            }
        }
        return { vpip, pfr };
    }
}

module.exports = new HandParser();