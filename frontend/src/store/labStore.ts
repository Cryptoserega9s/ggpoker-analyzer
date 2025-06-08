import { create } from 'zustand';
import axios from 'axios';

// --- НОВЫЕ ТИПЫ ДАННЫХ ---
type GeneralStats = {
  vpip: string;
  pfr: string;
  three_bet: string;
  totalHands: number;
};

type HandMatrixStat = {
  hand: string;
  profit: number;
  count: number;
};

type LabState = {
  filters: {
    position: string;
    stackFrom: number;
    stackTo: number;
  };
  generalStats: GeneralStats | null;
  handMatrixStats: HandMatrixStat[];
  loading: boolean;
  setFilters: (newFilters: Partial<LabState['filters']>) => void;
  fetchFilteredStats: () => Promise<void>;
};
// --- КОНЕЦ НОВЫХ ТИПОВ ---


// Начальное состояние фильтров
const initialFilters = {
  position: 'BTN',
  stackFrom: 0,
  stackTo: 100,
};

// Используем наш новый тип LabState
export const useLabStore = create<LabState>((set, get) => ({
  filters: initialFilters,
  generalStats: null,
  handMatrixStats: [],
  loading: false,
  
  // Функция для изменения фильтров
  setFilters: (newFilters) => {
    set((state) => ({ filters: { ...state.filters, ...newFilters } }));
    get().fetchFilteredStats();
  },

  // Функция для запроса данных с бэкенда
  fetchFilteredStats: async () => {
    set({ loading: true });
    const { filters } = get();
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get('http://localhost:5000/api/analytics/filtered-stats', {
        headers: { 'Authorization': `Bearer ${token}` },
        params: filters,
      });
      set({ 
        generalStats: response.data.generalStats,
        handMatrixStats: response.data.handMatrixStats,
        loading: false 
      });
    } catch (error) {
      console.error("Failed to fetch lab stats:", error);
      set({ loading: false });
    }
  },
}));