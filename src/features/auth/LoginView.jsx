import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/authStore';

const LoginView = () => {
  const [credencial, setCredencial] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { setCredentials, isAuthenticated, role } = useAuthStore();

  // Si ya está autenticado, lo enviamos a su dashboard
  useEffect(() => {
    if (isAuthenticated) {
      if (role === 'ADMIN') navigate('/admin');
      else if (role === 'CLIENTE') navigate('/cliente');
    }
  }, [isAuthenticated, role, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Ajusta la estructura del payload a lo que espera tu API
      const response = await api.post('/api/Auth/login', {
        credencial,
        password
      });

      // Se asume que el backend retorna: { token, rol, usuario: {...} }
      // Asegurar que tu backend devuelva mayúsculas en el rol ('ADMIN', 'CLIENTE')
      const { token, rol, usuario } = response.data;
      
      const normalizedRole = rol.toUpperCase();

      setCredentials(usuario || credencial, token, normalizedRole);
      
      // La redirección ocurrirá por el useEffect al cambiar el store
    } catch (err) {
      console.error('Error de login:', err);
      // Muestra mensaje de error del backend o uno genérico
      setError(err.response?.data?.message || 'Credenciales inválidas o error de conexión.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-black text-slate-900 tracking-tight">
          Banco Central
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 uppercase tracking-widest font-semibold">
          Portal de Acceso Seguro
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm font-semibold border border-red-200 text-center">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="credencial" className="block text-sm font-bold text-slate-700 mb-1">
                Credencial de Acceso
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" aria-hidden="true" />
                </div>
                <input
                  id="credencial"
                  name="credencial"
                  type="text"
                  required
                  value={credencial}
                  onChange={(e) => setCredencial(e.target.value)}
                  className="appearance-none block w-full pl-10 px-3 py-2.5 border-2 border-slate-200 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm font-medium transition-colors"
                  placeholder="Usuario o Identificación"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 px-3 py-2.5 border-2 border-slate-200 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm font-medium transition-colors"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                    Validando...
                  </>
                ) : (
                  'Ingresar al Sistema'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
