import { useState, useEffect } from 'react';
import { Container, Title, Grid, Paper, Text } from '@mantine/core';
import FileUpload from '../components/FileUpload';
import axios from 'axios';

// Создаем тип для нашей статистики, чтобы TypeScript нам помогал
interface MainStats {
  vpip: string;
  pfr: string;
  totalHands: number;
}

const DashboardPage = () => {
  // Состояние для хранения статистики
  const [stats, setStats] = useState<MainStats | null>(null);
  // Состояние для отслеживания загрузки
  const [loading, setLoading] = useState(true);
  // Состояние для ошибок
  const [error, setError] = useState('');

  // useEffect будет выполняться один раз после загрузки компонента
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Токен не найден');
        }

        // Запрашиваем статистику с нашего нового API
        const response = await axios.get('http://localhost:5000/api/analytics/main-stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        // Сохраняем полученные данные в состояние
        setStats(response.data);

      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Не удалось загрузить статистику');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []); // Пустой массив означает "выполнить один раз"

  // Функция для отображения карточек со статистикой
  const renderStats = () => {
    if (loading) {
      return <Text>Загрузка статистики...</Text>;
    }
    if (error) {
      return <Text c="red">{error}</Text>;
    }
    if (stats && stats.totalHands > 0) {
      return (
        <Grid>
          <Grid.Col span={4}>
            <Paper withBorder p="md" radius="md">
              <Text c="dimmed" size="xs" tt="uppercase" fw={700}>VPIP</Text>
              <Text fw={700} size="xl">{stats.vpip}%</Text>
            </Paper>
          </Grid.Col>
          <Grid.Col span={4}>
            <Paper withBorder p="md" radius="md">
              <Text c="dimmed" size="xs" tt="uppercase" fw={700}>PFR</Text>
              <Text fw={700} size="xl">{stats.pfr}%</Text>
            </Paper>
          </Grid.Col>
          <Grid.Col span={4}>
            <Paper withBorder p="md" radius="md">
              <Text c="dimmed" size="xs" tt="uppercase" fw={700}>Всего рук</Text>
              <Text fw={700} size="xl">{stats.totalHands}</Text>
            </Paper>
          </Grid.Col>
        </Grid>
      );
    }
    return <Text>Нет данных для отображения. Загрузите историю раздач.</Text>;
  };

  return (
    <Container my="md">
      <Title order={2} ta="center" mb="xl">
        Загрузка и Аналитика
      </Title>
      
      <FileUpload />

      <Title order={3} ta="center" mt="xl" mb="md">
        Основная статистика
      </Title>
      
      {renderStats()}

    </Container>
  );
};

export default DashboardPage;