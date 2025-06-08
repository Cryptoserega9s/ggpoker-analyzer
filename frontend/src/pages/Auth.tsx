import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
// --- НОВОЕ: Импортируем компоненты Mantine ---
import { Container, Title, Paper, TextInput, PasswordInput, Button, Text, Anchor } from '@mantine/core';
// --- НОВОЕ: Импортируем наше хранилище Zustand ---
import { useUserStore } from '../store/userStore';

const AuthPage = () => {
  // --- 1. ХУКИ И СОСТОЯНИЕ ---
  const location = useLocation();
  const navigate = useNavigate(); // Хук для программной навигации
  const isLogin = location.pathname === '/login';

  // Получаем функции login и registration из нашего хранилища
  const { login, registration } = useUserStore();

  // Локальное состояние для полей ввода
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Состояние для хранения ошибок

  // --- 2. ОБРАБОТЧИК КЛИКА ---
  const handleClick = async () => {
    try {
      setError(''); // Сбрасываем ошибку перед новым запросом
      if (isLogin) {
        await login(email, password);
      } else {
        await registration(email, password);
      }
      // Если логин/регистрация прошли успешно, перенаправляем на дашборд
      navigate('/dashboard');
    } catch (e: any) {
      // Если бэкенд вернул ошибку, отображаем ее
      setError(e.response?.data?.message || 'Произошла неизвестная ошибка');
      console.error(e);
    }
  };

  // --- 3. JSX РАЗМЕТКА ---
  return (
    <Container size={420} my={40}>
      <Title ta="center">
        {isLogin ? 'Добро пожаловать!' : 'Создать аккаунт'}
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        {isLogin ? (
          <>
            Еще нет аккаунта?{' '}
            <Anchor size="sm" component={Link} to="/registration">
              Зарегистрироваться
            </Anchor>
          </>
        ) : (
          <>
            Уже есть аккаунт?{' '}
            <Anchor size="sm" component={Link} to="/login">
              Войти
            </Anchor>
          </>
        )}
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput
          label="Email"
          placeholder="your@email.com"
          required
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
        />
        <PasswordInput
          label="Пароль"
          placeholder="Ваш пароль"
          required
          mt="md"
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
        />
        
        {/* Отображаем ошибку, если она есть */}
        {error && <Text c="red" size="sm" mt="sm">{error}</Text>}

        <Button fullWidth mt="xl" onClick={handleClick}>
          {isLogin ? 'Войти' : 'Зарегистрироваться'}
        </Button>
      </Paper>
    </Container>
  );
};

export default AuthPage;