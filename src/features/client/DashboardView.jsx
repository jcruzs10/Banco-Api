import { useState, useEffect } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { api } from '../../../services/api';
import { RefreshCcw, Wallet } from 'lucide-react';

const DashboardView = () => {
  const { user } = useAuthStore();
  const [saldo, setSaldo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Identificador de cuenta: se extrae del payload de sesión.
  // Asumiendo que el JWT/Backend retorna { idCuenta: 1, nombre: '...' }
  const idCuenta = user?.idCuenta || user?.id || 1;

  const fetchSaldo = async () => {
    setIsLoading(true);
    setError('');
    try {
      // Auto-fetch sin intervención del usuario
      const response = await api.get(`/api/Operaciones/saldo/${idCuenta}`);
      // Asumiendo formato de respuesta { saldo: 1500.50 }
      setSaldo(response.data?.saldo ?? response.data); 
    } catch (err) {
      console.error('Error al obtener saldo:', err);
      setError('No se pudo cargar la información de la cuenta en este momento.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSaldo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idCuenta]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Resumen Financiero</h1>
        <p className="text-slate-500 mt-1">Estado de tu cuenta monetaria en tiempo real.</p>
      </header>

      {/* Widget de Saldo */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 relative overflow-hidden">
        {/* Decoración sutil */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-50 rounded-full opacity-50 pointer-events-none"></div>
        
        <div className="relative flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Saldo Disponible</p>
              <p className="text-xs text-slate-400 mt-0.5">ID Cuenta: #{idCuenta}</p>
            </div>
          </div>
          
          <button 
            onClick={fetchSaldo} 
            disabled={isLoading}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-50"
            title="Actualizar saldo"
          >
            <RefreshCcw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="mt-8">
          {isLoading ? (
            // Skeleton Loader
            <div className="animate-pulse">
              <div className="h-12 bg-slate-200 rounded w-48 mb-2"></div>
              <div className="h-4 bg-slate-100 rounded w-32"></div>
            </div>
          ) : error ? (
            <div className="text-red-600 font-medium py-4">
              {error}
            </div>
          ) : (
            <div>
              <h2 className="text-5xl font-black text-slate-900 font-mono tracking-tighter">
                <span className="text-slate-400 text-3xl font-sans mr-1">Q</span>
                {typeof saldo === 'number' ? saldo.toLocaleString('es-GT', { minimumFractionDigits: 2 }) : saldo}
              </h2>
              <p className="text-emerald-600 text-sm font-bold mt-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Actualizado exitosamente
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
