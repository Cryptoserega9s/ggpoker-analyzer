import { Routes, Route, Navigate } from 'react-router-dom';
// --- НОВОЕ: Импортируем наше хранилище Zustand ---
import { useUserStore } from '../store/userStore';

import AuthPage from '../pages/Auth';
import DashboardPage from '../pages/Dashboard';
import HomePage from '../pages/Home';

const AppRouter = () => {
  // --- ИЗМЕНЕНО: Получаем актуальное состояние isAuth из хранилища ---
  // Теперь наш роутер "реактивный". Он будет автоматически перерисовываться
  // при изменении isAuth в userStore.
  const { isAuth } = useUserStore();

  return (
    <Routes>
      {/* Приватные маршруты, доступные только авторизованным пользователям */}
      {isAuth && (
        <Route path="/dashboard" element={<DashboardPage />} />
      )}

      {/* Публичные маршруты, доступные всем */}
      <Route path="/login" element={<AuthPage />} />
      <Route path="/registration" element={<AuthPage />} />
      <Route path="/home" element={<HomePage />} />

      {/* 
        Если пользователь пытается зайти на любой другой маршрут,
        мы его перенаправляем:
        - если он авторизован, то на дашборд
        - если нет, то на главную страницу
      */}
      <Route path="*" element={<Navigate to={isAuth ? "/dashboard" : "/home"} />} />
    </Routes>
  );
};

export default AppRouter;