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
        const handInfoMatch = handText.match(/Poker Hand #(?<handId>.*?):.*?Tournament #(?<tournamentId>\d+)?/);
        const dateTimeMatch = handText.match(/\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}/);
        const blindsMatch = handText.match(/Level\d+\s*\((?<sb>[\d,]+)\/(?<bb>[\d,]+)\)/);

        if (!handInfoMatch || !dateTimeMatch || !blindsMatch) return null;

        const handId = handInfoMatch.groups.handId;
        const tournamentId = handInfoMatch.groups.tournamentId || null;
        const playedAt = new Date(dateTimeMatch[0]);
        const bigBlindSize = parseInt(blindsMatch.groups.bb.replace(/,/g, ''), 10);
        const isFinalTable = handText.includes('9-max');

        const tableSetupBlock = handText.split('*** HOLE CARDS ***')[0];
        const playerSeatMatches = [...tableSetupBlock.matchAll(/Seat (?<seatNumber>\d+): (?<playerName>.*?) \((?<stack>[\d,]+) in chips\)/g)];
        const playersCount = playerSeatMatches.length;
        if (playersCount < 2) return null;

        const heroInfo = playerSeatMatches.find(m => m.groups.playerName === 'Hero');
        if (!heroInfo) return null;

        const heroStackInChips = parseInt(heroInfo.groups.stack.replace(/,/g, ''), 10);
        const heroStackInBB = parseFloat((heroStackInChips / bigBlindSize).toFixed(2));
        const heroSeatNumber = parseInt(heroInfo.groups.seatNumber, 10);

        const buttonSeatMatch = tableSetupBlock.match(/Seat #(?<seatNumber>\d+) is the button/);
        if (!buttonSeatMatch) return null;
        const buttonSeatNumber = parseInt(buttonSeatMatch.groups.buttonSeatNumber, 10);
        
        const activeSeats = playerSeatMatches.map(m => parseInt(m.groups.seatNumber));
        const heroPosition = this._getPlayerPosition(heroSeatNumber, buttonSeatNumber, activeSeats, handText);

        const heroCardsMatch = handText.match(/Dealt to Hero \[(?<cards>.*?)\]/);
        if (!heroCardsMatch) return null;
        const startingHand = this._normalizeHand(heroCardsMatch.groups.cards.split(' ')[0], heroCardsMatch.groups.cards.split(' ')[1]);

        const actionFlags = this._getActionFlags(handText, 'Hero');
        const outcome = this._getOutcome(handText, 'Hero', bigBlindSize);
        
        return {
            hand_id: handId,
            tournament_id: tournamentId,
            played_at: playedAt,
            big_blind_size: bigBlindSize,
            hero_position: heroPosition,
            starting_hand: startingHand,
            hero_stack_in_bb: heroStackInBB,
            players_at_table: playersCount,
            is_final_table: isFinalTable,
            ...actionFlags,
            ...outcome,
        };
    }

    _getActionFlags(handText, heroName) {
        const preflopBlock = handText.split('*** HOLE CARDS ***')[1].split('*** FLOP ***')[0];
        const preflopActions = preflopBlock.trim().split('\n').filter(line => !line.startsWith('Dealt to'));
    
        const result = {
            hero_vpip: false,
            hero_pfr: false,
            hero_limped: false,
            hero_cold_called: false,
            hero_made_3bet: false,
            hero_faced_3bet: false,
            hero_called_3bet: false,
            hero_folded_to_3bet: false,
            hero_made_4bet: false,
            hero_made_squeeze: false,
            hero_attempted_steal: false,
            saw_flop: handText.includes('*** FLOP ***'),
            saw_turn: handText.includes('*** TURN ***'),
            saw_river: handText.includes('*** RIVER ***'),
        };
    
        let raisesCount = 0;
        let limpersCount = 0;
        let callersCount = 0;
        let heroFirstAction = true;
    
        for (const action of preflopActions) {
            const isHeroAction = action.startsWith(heroName + ':');
    
            if (action.includes('raises')) {
                if (isHeroAction) {
                    if (raisesCount === 1) result.hero_made_3bet = true;
                    if (raisesCount >= 2) result.hero_made_4bet = true;
                } else {
                    if (raisesCount === 1) result.hero_faced_3bet = true;
                }
                raisesCount++;
            } else if (action.includes('calls')) {
                if (raisesCount === 0) limpersCount++;
                callersCount++;
            }
    
            if (isHeroAction) {
                if (action.includes('raises') || action.includes('calls')) result.hero_vpip = true;
    
                if (heroFirstAction) {
                    if (action.includes('raises')) {
                        result.hero_pfr = true;
                        if (raisesCount === 2 && callersCount > 0) result.hero_made_squeeze = true;
                    } else if (action.includes('calls')) {
                        if (raisesCount === 0) result.hero_limped = true;
                        if (raisesCount === 1) result.hero_cold_called = true;
                        if (raisesCount === 2) result.hero_called_3bet = true;
                    }
                    heroFirstAction = false;
                }
            }
        }
        
        const heroFolded = preflopActions.some(action => action.startsWith(heroName + ': folds'));
        if (result.hero_faced_3bet && heroFolded && !result.hero_called_3bet && !result.hero_made_4bet) {
            result.hero_folded_to_3bet = true;
        }
    
        return result;
    }

    _getOutcome(handText, heroName, bbSize) {
        let totalInvested = 0;
        const heroActions = handText.split('\n').filter(line => line.startsWith(heroName + ':'));
        for (const action of heroActions) {
            const betMatch = action.match(/(?:posts|bets|calls|raises).*? ([\d,]+)/);
            if (betMatch) {
                totalInvested += parseInt(betMatch[1].replace(/,/g, ''), 10);
            }
        }
    
        let winnings = 0;
        const summaryBlock = handText.split('*** SUMMARY ***')[1] || '';
        const heroSummaryLine = summaryBlock.split('\n').find(line => line.includes(heroName));
    
        if (heroSummaryLine) {
            const collectedMatch = heroSummaryLine.match(/(?:won|collected) \(([\d,]+)\)/);
            if (collectedMatch) {
                winnings = parseInt(collectedMatch[1].replace(/,/g, ''), 10);
            }
        }
    
        const netResultChips = winnings - totalInvested;
        return {
            went_to_showdown: handText.includes('*** SHOW DOWN ***'),
            won_hand: winnings > 0,
            net_result_bb: parseFloat((netResultChips / bbSize).toFixed(2)),
        };
    }
    
        _getPlayerPosition(playerSeat, buttonSeat, activeSeats) {
        const playersCount = activeSeats.length;

        // Определяем карту позиций в зависимости от количества игроков
        // Названия стандартные, до 5 символов максимум (UTG+1)
        const positionNames = {
            9: ['BTN', 'SB', 'BB', 'UTG', 'UTG+1', 'MP', 'LJ', 'HJ', 'CO'],
            8: ['BTN', 'SB', 'BB', 'UTG', 'UTG+1', 'MP', 'HJ', 'CO'],
            7: ['BTN', 'SB', 'BB', 'UTG', 'MP', 'HJ', 'CO'],
            6: ['BTN', 'SB', 'BB', 'UTG', 'MP', 'CO'],
            5: ['BTN', 'SB', 'BB', 'UTG', 'CO'],
            4: ['BTN', 'SB', 'BB', 'UTG'],
            3: ['BTN', 'SB', 'BB'],
            2: ['SB', 'BB'], // В HU баттон всегда является SB
        }[playersCount];
        
        // Если для такого стола нет карты, возвращаем UNKNOWN
        if (!positionNames) {
            return 'UNKN';
        }

        // В HU у баттона специальная логика
        if (playersCount === 2) {
            return playerSeat === buttonSeat ? 'SB' : 'BB';
        }

        // Сортируем активные места, чтобы получить порядок хода
        const sortedSeats = [...activeSeats].sort((a, b) => a - b);

        // Находим индекс баттона и игрока в этом отсортированном массиве
        const buttonIndex = sortedSeats.indexOf(buttonSeat);
        const playerIndex = sortedSeats.indexOf(playerSeat);

        // Вычисляем "смещение" игрока относительно баттона по часовой стрелке
        // 0 = BTN, 1 = SB, 2 = BB, 3 = UTG, и т.д.
        const relativeIndex = (playerIndex - buttonIndex + playersCount) % playersCount;
        
        // Возвращаем название позиции из нашей карты
        return positionNames[relativeIndex];
    }
    
    _normalizeHand(card1, card2) {
        const ranks = 'AKQJT98765432';
        const r1 = card1.charAt(0);
        const r2 = card2.charAt(0);
        const s1 = card1.charAt(1);
        const s2 = card2.charAt(1);
        const suited = s1 === s2 ? 's' : 'o';
        if (r1 === r2) return r1 + r2;
        return ranks.indexOf(r1) < ranks.indexOf(r2) ? r1 + r2 + suited : r2 + r1 + suited;
    }
}

module.exports = new HandParser();