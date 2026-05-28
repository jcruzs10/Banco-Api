import { useState } from 'react';
import { api } from '../../../services/api';
import { useAuthStore } from '../../../store/authStore';
import { Receipt, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';

const PaymentView = () => {
  const { user } = useAuthStore();
  const idCuentaOrigen = user?.idCuenta || user?.id || 1;

  const [servicio, setServicio] = useState('1'); // 1: Universidad, 2: Luz, etc.
  const [identificadorCliente, setIdentificadorCliente] = useState('');
  const [monto, setMonto] = useState('');
  const [tarjeta, setTarjeta] = useState('');
  const [pin, setPin] = useState('');
  const [referencia, setReferencia] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Envía la petición con todos los campos requeridos por el backend.
      // La lógica 95/5 es calculada o manejada por el backend en /api/Pagos/ejecutar.
      // Si el frontend estuviera obligado a mandarlo particionado, se haría aquí antes de enviar,
      // pero nunca se expone al cliente en la UI.
      await api.post('/api/Pagos/ejecutar', {
        cuentaOrigen: parseInt(idCuentaOrigen, 10),
        idServicio: parseInt(servicio, 10),
        identificadorCliente,
        montoTotal: parseFloat(monto),
        tarjetaDebito: tarjeta,
        pinSeguridad: pin,
        referencia: referencia || 'Pago de Servicio vía Portal'
      });

      setSuccess(true);
      // Limpiar formulario tras éxito
      setIdentificadorCliente('');
      setMonto('');
      setTarjeta('');
      setPin('');
      setReferencia('');
    } catch (err) {
      console.error('Error en pago:', err);
      setError(err.response?.data?.message || 'El pago no pudo procesarse. Verifica tu saldo y que tu PIN sea correcto.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Pago de Servicios</h1>
        <p className="text-slate-500 mt-1">Cancela servicios públicos y privados de forma segura.</p>
      </header>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
        {success ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Pago Realizado con Éxito</h3>
            <p className="text-slate-500 mb-8">Tu comprobante ha sido generado internamente y reflejado en el sistema de la empresa.</p>
            <button 
              onClick={() => setSuccess(false)}
              className="bg-slate-900 text-white font-bold py-3 px-6 rounded-xl hover:bg-slate-800 transition-colors"
            >
              Realizar Otro Pago
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Formulario Izquierdo */}
            <form onSubmit={handleSubmit} className="flex-1 space-y-6">
              {error && (
                <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm font-semibold">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b pb-2">Datos del Servicio</h3>
                
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Empresa a Pagar</label>
                  <select 
                    value={servicio}
                    onChange={(e) => setServicio(e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 font-bold text-slate-700 transition-all"
                  >
                    <option value="1">Universidad (Cuota / Matrícula)</option>
                    <option value="2">Empresa Eléctrica (Contador)</option>
                    <option value="3">Telefonía Móvil o Residencial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Identificador (Carné, Contador, Teléfono)</label>
                  <input
                    type="text"
                    required
                    value={identificadorCliente}
                    onChange={(e) => setIdentificadorCliente(e.target.value)}
                    placeholder="Ej. 20210001"
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 font-medium transition-all"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b pb-2">Autorización Bancaria</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Tarjeta de Débito</label>
                    <input
                      type="text"
                      required
                      value={tarjeta}
                      onChange={(e) => setTarjeta(e.target.value)}
                      placeholder="16 Dígitos"
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 font-medium transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">PIN</label>
                    <input
                      type="password"
                      required
                      maxLength="4"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="••••"
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 font-mono tracking-widest text-center text-lg transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Referencia de Pago (Opcional)</label>
                  <input
                    type="text"
                    value={referencia}
                    onChange={(e) => setReferencia(e.target.value)}
                    placeholder="Ej. Cuota de Noviembre"
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 font-medium transition-all"
                  />
                </div>
              </div>
            </form>

            {/* Panel Derecho: Liquidación (Total UX focus) */}
            <div className="w-full lg:w-80 bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600"></div>
              
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Total a Debitar</p>
                <div className="relative">
                  <span className="absolute top-1 left-0 text-2xl font-bold text-slate-400">Q</span>
                  <input
                    type="number"
                    required
                    min="0.01"
                    step="0.01"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-8 py-2 bg-transparent text-5xl font-black text-slate-900 border-none outline-none placeholder-slate-300"
                    autoFocus
                  />
                </div>
                <div className="mt-4 flex items-start gap-2 text-xs text-slate-500 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p>Al confirmar el pago, este monto será debitado de tu cuenta bancaria asociada.</p>
                </div>
              </div>

              <div className="pt-8">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isLoading || !monto || parseFloat(monto) <= 0}
                  className="w-full flex items-center justify-center py-4 px-4 rounded-xl shadow-lg shadow-blue-900/20 text-base font-bold text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                      Procesando...
                    </>
                  ) : (
                    'Confirmar Pago'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentView;
