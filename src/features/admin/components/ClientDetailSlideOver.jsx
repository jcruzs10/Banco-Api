import { useState } from 'react';
import { api } from '../../../services/api';
import { X, User, CreditCard, History, Loader2, Save } from 'lucide-react';

const ClientDetailSlideOver = ({ client, onClose }) => {
  const [activeTab, setActiveTab] = useState('perfil'); // perfil | operaciones | bitacora
  
  // Estados para Creación/Edición
  const [dpi, setDpi] = useState(client?.dpi || '');
  const [nit, setNit] = useState(client?.nit || '');
  const [nombre, setNombre] = useState(client?.nombre || '');
  const [apellido, setApellido] = useState(client?.apellido || '');
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Tab: Bitácora
  const [historial, setHistorial] = useState(null);
  const [loadingHistorial, setLoadingHistorial] = useState(false);

  const isCreating = !client;

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      if (isCreating) {
        await api.post('/api/Cuentahabientes/perfil', {
          dpi, nit, nombre, apellido, tipoCuenta: 1
        });
        setMessage('Cuentahabiente registrado exitosamente.');
      } else {
        // Lógica de update si existiera
        setMessage('Perfil actualizado (simulado).');
      }
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAsociarTarjeta = async () => {
    setIsLoading(true);
    setMessage('');
    try {
      await api.post('/api/Cuentahabientes/tarjeta', {
        cuentaBancariaId: client.id
      });
      setMessage('Tarjeta asociada exitosamente al cliente.');
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const loadHistorial = async () => {
    if (!client?.id) return;
    setLoadingHistorial(true);
    try {
      const response = await api.get(`/api/Bitacora/kardex/${client.id}`);
      setHistorial(response.data);
    } catch (error) {
      setHistorial([]);
      console.error(error);
    } finally {
      setLoadingHistorial(false);
    }
  };

  // Cargar historial si la tab cambia a bitácora
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'bitacora' && !historial) {
      loadHistorial();
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* SlideOver Panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            {isCreating ? 'Nuevo Cuentahabiente' : `Expediente: ${client.nombre}`}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => handleTabChange('perfil')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${activeTab === 'perfil' ? 'border-b-2 border-amber-500 text-amber-600 bg-amber-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <User className="w-4 h-4" /> Perfil
          </button>
          {!isCreating && (
            <>
              <button
                onClick={() => handleTabChange('operaciones')}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${activeTab === 'operaciones' ? 'border-b-2 border-amber-500 text-amber-600 bg-amber-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <CreditCard className="w-4 h-4" /> Operaciones
              </button>
              <button
                onClick={() => handleTabChange('bitacora')}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${activeTab === 'bitacora' ? 'border-b-2 border-amber-500 text-amber-600 bg-amber-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <History className="w-4 h-4" /> Bitácora
              </button>
            </>
          )}
        </div>

        {/* Mensajes globales de tab */}
        {message && (
          <div className="m-4 p-3 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 text-sm font-medium">
            {message}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'perfil' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">DPI</label>
                <input type="text" required value={dpi} onChange={e=>setDpi(e.target.value)} className="w-full border-2 border-slate-200 rounded-lg p-2.5 outline-none focus:border-amber-500" placeholder="0000 00000 0000" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">NIT</label>
                <input type="text" required value={nit} onChange={e=>setNit(e.target.value)} className="w-full border-2 border-slate-200 rounded-lg p-2.5 outline-none focus:border-amber-500" placeholder="123456-7" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nombre</label>
                  <input type="text" required value={nombre} onChange={e=>setNombre(e.target.value)} className="w-full border-2 border-slate-200 rounded-lg p-2.5 outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Apellido</label>
                  <input type="text" required value={apellido} onChange={e=>setApellido(e.target.value)} className="w-full border-2 border-slate-200 rounded-lg p-2.5 outline-none focus:border-amber-500" />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button type="submit" disabled={isLoading} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2">
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {isCreating ? 'Crear Cuentahabiente' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'operaciones' && !isCreating && (
            <div className="space-y-6">
              <div className="p-5 border-2 border-dashed border-slate-200 rounded-2xl text-center">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 mb-1">Asociación de Plástico</h3>
                <p className="text-xs text-slate-500 mb-4">Genera y vincula una nueva tarjeta de débito automáticamente a la cuenta ID #{client.id}.</p>
                <button 
                  onClick={handleAsociarTarjeta}
                  disabled={isLoading}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2.5 px-6 rounded-lg w-full transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generar Tarjeta'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'bitacora' && !isCreating && (
            <div>
              {loadingHistorial ? (
                <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-slate-300" /></div>
              ) : historial?.length > 0 ? (
                <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-4 before:w-0.5 before:bg-slate-200 pl-10">
                  {historial.map((entry, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-10 w-3 h-3 bg-white border-2 border-amber-500 rounded-full mt-1.5" />
                      <p className="text-sm font-bold text-slate-800">{entry.descripcion}</p>
                      <p className="text-xs text-slate-500">{new Date(entry.fecha).toLocaleString()}</p>
                      <p className={`text-sm font-bold mt-1 ${entry.tipo === 'CREDITO' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {entry.tipo === 'CREDITO' ? '+' : '-'} Q{entry.monto}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-slate-500 text-sm py-8">No se encontraron movimientos.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ClientDetailSlideOver;
