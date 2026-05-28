import { useState } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { api } from '../../../services/api';
import { ArrowRightLeft, Loader2, CheckCircle2 } from 'lucide-react';

const TransferView = () => {
  const { user } = useAuthStore();
  const idCuentaOrigen = user?.idCuenta || user?.id || 1;

  const [cuentaDestino, setCuentaDestino] = useState('');
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      // El ID de la cuenta origen se extrae e inyecta silenciosamente
      await api.post('/api/Operaciones/transferir', {
        cuentaOrigen: parseInt(idCuentaOrigen, 10),
        cuentaDestino: parseInt(cuentaDestino, 10),
        monto: parseFloat(monto),
        descripcion: descripcion || 'Transferencia desde Portal Web'
      });
      
      setSuccess(true);
      setCuentaDestino('');
      setMonto('');
      setDescripcion('');
    } catch (err) {
      console.error('Error en transferencia:', err);
      setError(err.response?.data?.message || 'La transferencia no pudo ser procesada. Verifica tu saldo o la cuenta destino.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Transferencia Electrónica</h1>
        <p className="text-slate-500 mt-1">Envía fondos instantáneamente a otras cuentas.</p>
      </header>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
        {success ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Transferencia Exitosa</h3>
            <p className="text-slate-500 mb-8">Los fondos han sido depositados en la cuenta destino inmediatamente.</p>
            <button 
              onClick={() => setSuccess(false)}
              className="bg-slate-900 text-white font-bold py-3 px-6 rounded-xl hover:bg-slate-800 transition-colors"
            >
              Realizar Otra Transferencia
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
            {error && (
              <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm font-semibold">
                {error}
              </div>
            )}

            {/* Fricción eliminada: Cuenta Origen invisible, solo informamos desde dónde sale */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
              <ArrowRightLeft className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Débito Automático Desde</p>
                <p className="text-sm font-bold text-slate-900">Tu Cuenta #{idCuentaOrigen}</p>
              </div>
            </div>

            <div>
              <label htmlFor="cuentaDestino" className="block text-sm font-bold text-slate-700 mb-2">
                Cuenta Destino
              </label>
              <input
                id="cuentaDestino"
                type="number"
                required
                min="1"
                value={cuentaDestino}
                onChange={(e) => setCuentaDestino(e.target.value)}
                placeholder="ID de la cuenta receptora"
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 font-medium transition-all"
              />
            </div>

            <div>
              <label htmlFor="monto" className="block text-sm font-bold text-slate-700 mb-2">
                Monto (Q)
              </label>
              <input
                id="monto"
                type="number"
                required
                min="0.01"
                step="0.01"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 text-xl font-bold text-slate-900 transition-all"
              />
            </div>

            <div>
              <label htmlFor="descripcion" className="block text-sm font-bold text-slate-700 mb-2">
                Descripción / Concepto
              </label>
              <input
                id="descripcion"
                type="text"
                required
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Ej. Pago de alquiler"
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 font-medium transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-900/20 text-base font-bold text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Procesando Transferencia...
                </>
              ) : (
                'Confirmar y Enviar Fondos'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default TransferView;
