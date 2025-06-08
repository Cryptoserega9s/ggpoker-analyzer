import { create } from 'zustand';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Описываем "типы" данных, которые будут в нашем хранилище
interface User {
  id: number | null;
  email: string | null;
  role: string | null;
}

interface UserState {
  user: User;
  isAuth: boolean;
  setUser: (user: User) => void;
  setIsAuth: (isAuth: boolean) => void;
  registration: (email: string, password: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
}

// Создаем наше хранилище
export const useUserStore = create<UserState>((set) => ({
  // Начальные значения
  user: { id: null, email: null, role: null },
  isAuth: false,

  // "Сеттеры" - функции для изменения состояния
  setUser: (user) => set({ user }),
  setIsAuth: (isAuth) => set({ isAuth }),

  // Асинхронные действия (actions)
  registration: async (email, password) => {
    const response = await axios.post('http://localhost:5000/api/user/registration', {
      email,
      password,
    });
    // Сохраняем токен в localStorage браузера
    localStorage.setItem('token', response.data.token);
    // Декодируем токен, чтобы получить данные пользователя
    const decodedUser: User = jwtDecode(response.data.token);
    // Обновляем состояние
    set({ user: decodedUser, isAuth: true });
    return decodedUser;
  },

  login: async (email, password) => {
    const response = await axios.post('http://localhost:5000/api/user/login', {
      email,
      password,
    });
    localStorage.setItem('token', response.data.token);
    const decodedUser: User = jwtDecode(response.data.token);
    set({ user: decodedUser, isAuth: true });
    return decodedUser;
  },
}));