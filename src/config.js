// Configuración global del cliente frontend
export const API_URL = import.meta.env.VITE_API_URL || '';

if (!API_URL) {
  console.warn('[Banco API] VITE_API_URL no está definida. Se utilizarán rutas relativas.');
}
