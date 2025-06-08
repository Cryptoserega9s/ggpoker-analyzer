import { useLabStore } from '../store/labStore';
import { Box, Tooltip, Text } from '@mantine/core';

// --- ОПРЕДЕЛЯЕМ ТИП ДЛЯ НАШЕЙ СТАТИСТИКИ ---
type HandMatrixStat = {
  hand: string;
  profit: number;
  count: number;
};

// --- ОПРЕДЕЛЯЕМ ТИП ДЛЯ НАШЕЙ "КАРТЫ" СТАТИСТИКИ ---
type StatsMap = {
  [key: string]: HandMatrixStat;
};

const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

const HandMatrix = () => {
  const { handMatrixStats } = useLabStore();
  
  // Указываем TypeScript, что statsMap будет иметь тип StatsMap
  const statsMap: StatsMap = handMatrixStats.reduce((acc, stat) => {
    acc[stat.hand] = stat;
    return acc;
  }, {} as StatsMap); // Начальное значение тоже типизируем

  // Указываем, что profit - это число
  const getCellColor = (profit: number) => {
    if (profit > 100) return 'green.9';
    if (profit > 0) return 'green.7';
    if (profit < -100) return 'red.9';
    if (profit < 0) return 'red.7';
    return 'gray.8';
  };
  
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(13, 1fr)', gap: '4px', maxWidth: '600px', margin: 'auto' }}>
      {ranks.map((r1, i) =>
        ranks.map((r2, j) => {
          let hand: string;
          if (i < j) hand = `${r1}${r2}s`;
          else if (i > j) hand = `${r2}${r1}o`;
          else hand = `${r1}${r2}`;

          const stat = statsMap[hand];
          // Если статистика есть, используем ее цвет, иначе - серый
          const color = stat ? getCellColor(stat.profit) : 'gray.9';
          
          return (
            // Указываем TypeScript, что stat может быть неопределенным
            <Tooltip key={hand} label={stat ? `${hand}: ${stat.profit.toFixed(1)}bb (${stat.count})` : hand}>
              <Box bg={color} style={{ aspectRatio: '1 / 1', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}>
                <Text size="sm" c="white" fw={500}>{hand}</Text>
              </Box>
            </Tooltip>
          );
        })
      )}
    </div>
  );
};
export default HandMatrix;