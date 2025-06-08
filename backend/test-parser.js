const handParser = require('./services/hand-parser');

// Используем все примеры, которые ты предоставил
const handHistoryText = `
Poker Hand #BR690841950: Tournament #200234205, Mystery Battle Royale $3 Hold'em No Limit - Level12(400/800) - 2025/04/09 22:12:58
Table '1' 9-max Seat #4 is the button
Seat 4: Hero (12,586 in chips)
Seat 7: bf4ad8db (5,414 in chips)
Hero: posts the ante 160
bf4ad8db: posts the ante 160
Hero: posts small blind 400
bf4ad8db: posts big blind 800
*** HOLE CARDS ***
Dealt to Hero [8c Qs]
Dealt to bf4ad8db 
Hero: raises 11,626 to 12,426
bf4ad8db: calls 4,454
Uncalled bet (7,172) returned to Hero
Hero: shows [8c Qs]
bf4ad8db: shows [3h Qc]
*** FLOP *** [Th 9h Ad]
*** TURN *** [Th 9h Ad] [6c]
*** RIVER *** [Th 9h Ad 6c] [4d]
*** SHOWDOWN ***
Hero collected 10,828 from pot
*** SUMMARY ***
Total pot 10,828 | Rake 0 | Jackpot 0 | Bingo 0 | Fortune 0 | Tax 0
Board [Th 9h Ad 6c 4d]
Seat 4: Hero (small blind) showed [8c Qs] and won (10,828) with Ace high
Seat 7: bf4ad8db (big blind) showed [3h Qc] and lost with Ace high

Poker Hand #BR703433964: Tournament #202500638, Mystery Battle Royale $3 Hold'em No Limit - Level5(50/100) - 2025/04/21 23:55:11
Table '84' 5-max Seat #1 is the button
Seat 1: 7c8f9a86 (2,528 in chips)
Seat 2: 99d4ed63 (2,938 in chips)
Seat 3: Hero (300 in chips)
Seat 4: e5617311 (2,214 in chips)
Seat 5: b88aa10 (1,189 in chips)
Hero: posts the ante 20
99d4ed63: posts the ante 20
b88aa10: posts the ante 20
e5617311: posts the ante 20
7c8f9a86: posts the ante 20
99d4ed63: posts small blind 50
Hero: posts big blind 100
*** HOLE CARDS ***
Dealt to 7c8f9a86 
Dealt to 99d4ed63 
Dealt to Hero [7c 4c]
Dealt to e5617311 
Dealt to b88aa10 
e5617311: raises 100 to 200
b88aa10: folds
7c8f9a86: raises 2,308 to 2,508
99d4ed63: folds
Hero: calls 180
e5617311: folds
Uncalled bet (2,228) returned to 7c8f9a86
7c8f9a86: shows [9s 9h]
Hero: shows [7c 4c]
*** FLOP *** [8c 8d Kd]
*** TURN *** [8c 8d Kd] [3c]
*** RIVER *** [8c 8d Kd 3c] [2s]
*** SHOWDOWN ***
7c8f9a86 collected 910 from pot
*** SUMMARY ***
Total pot 910 | Rake 0 | Jackpot 0 | Bingo 0 | Fortune 0 | Tax 0
Board [8c 8d Kd 3c 2s]
Seat 1: 7c8f9a86 (button) showed [9s 9h] and won (910) with two pair, Nines and Eights
Seat 2: 99d4ed63 (small blind) folded before Flop
Seat 3: Hero (big blind) showed [7c 4c] and lost with a pair of Eights
Seat 4: e5617311 folded before Flop
Seat 5: b88aa10 folded before Flop
`;

console.log('--- Запуск тестового парсера ---');
const result = handParser.parseFile(handHistoryText);
console.log(result);
console.log('--- Тестовый парсер завершен ---');