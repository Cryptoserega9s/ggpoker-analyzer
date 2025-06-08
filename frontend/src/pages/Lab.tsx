import { Container, Title, Grid, SimpleGrid, Paper, Text } from '@mantine/core';
import FilterPanel from '../components/FilterPanel';
import HandMatrix from '../components/HandMatrix';
import { useLabStore } from '../store/labStore';
import { useEffect } from 'react';

const LabPage = () => {
  const { generalStats, fetchFilteredStats, loading } = useLabStore();

  // При первой загрузке страницы, запрашиваем данные с дефолтными фильтрами
  useEffect(() => {
    fetchFilteredStats();
  }, [fetchFilteredStats]);
  
  return (
    <Container my="md" fluid>
      <Title order={2} ta="center" mb="xl">
        Стратегическая Лаборатория
      </Title>
      <Grid>
        <Grid.Col span={3}>
          <FilterPanel />
        </Grid.Col>
        <Grid.Col span={6}>
          <HandMatrix />
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper withBorder p="md">
            <Title order={4}>Общая статистика</Title>
            {loading ? <Text>Загрузка...</Text> :
              <SimpleGrid cols={2} mt="md">
                <Text>VPIP:</Text><Text>{generalStats?.vpip}%</Text>
                <Text>PFR:</Text><Text>{generalStats?.pfr}%</Text>
                <Text>3-Bet:</Text><Text>{generalStats?.three_bet}%</Text>
                <Text>Всего рук:</Text><Text>{generalStats?.totalHands}</Text>
              </SimpleGrid>
            }
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
};
export default LabPage;