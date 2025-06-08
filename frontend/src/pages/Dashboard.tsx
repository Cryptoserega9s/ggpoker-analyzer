import { Container, Title } from '@mantine/core';
import FileUpload from '../components/FileUpload';

const DashboardPage = () => {
  return (
    <Container my="md">
      <Title order={2} ta="center" mb="xl">
        Загрузка и Аналитика
      </Title>

      {/* Вот наш новый компонент */}
      <FileUpload />
      
      {/* Здесь в будущем будут графики и статистика */}
    </Container>
  );
};

export default DashboardPage;