import axios, { AxiosInstance } from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";

// Устанавливаем базовый URL для всех запросов
const API_BASE_URL = BASE_URL;

// Создаем функцию, возвращающую экземпляр Axios с интерцептором
const useAxiosWithInterceptor = (): AxiosInstance => {
  // Создаем экземпляр Axios с базовым URL
  const jwtAxios = axios.create({ baseURL: API_BASE_URL });

  // Получаем функцию для навигации между страницами React Router
  const navigate = useNavigate();

  // Добавляем интерцептор ответов
  jwtAxios.interceptors.response.use(
    // Обработка успешного ответа
    (response) => {
      return response;
    },
    // Обработка ошибок ответа
    async (error) => {
      // Получаем оригинальный запрос, который вызвал ошибку
      const originalRequest = error.config;

      // Если ответ имеет статус 401 (Unauthorized)
      if (error.response?.status === 401) {
        // Навигируем пользователя на главную страницу
        const goRoot = () => navigate("/");
        goRoot();
      }
    }
  );

  // Возвращаем настроенный экземпляр Axios
  return jwtAxios;
};

// Экспортируем созданную функцию
export default useAxiosWithInterceptor;
