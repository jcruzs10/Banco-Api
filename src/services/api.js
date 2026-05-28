import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Instancia de Axios configurada
export const api = axios.create({
  // Utilizar la variable de entorno o un fallback local si no existe
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Request: Inyectar el Token Bearer si existe
api.interceptors.request.use(
  (config) => {
    // Obtenemos el estado actual del store
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de Response: Manejo global de 401 y 403
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si la API responde con 401 (No autorizado) o 403 (Prohibido)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn('Sesión expirada o acceso denegado. Cerrando sesión...');
      // Disparamos la función logout del store para limpiar la sesión y redirigir
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);
