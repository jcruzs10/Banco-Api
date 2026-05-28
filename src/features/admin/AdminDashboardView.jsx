import { useState, useEffect } from 'react';
import { Search, Plus, UserPlus, MoreVertical } from 'lucide-react';
import ClientDetailSlideOver from './components/ClientDetailSlideOver';

const AdminDashboardView = () => {
  const [search, setSearch] = useState('');
  const [clientes, setClientes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estado para el Master-Detail
  const [selectedClient, setSelectedClient] = useState(null); // null = cerrado, { client } = abiero, 'new' = creacion
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);

  // Simular la carga de clientes del Master (Se reemplazaría con api.get('/api/Cuentahabientes'))
  useEffect(() => {
    const fetchClientes = async () => {
      setIsLoading(true);
      // MOCK DATA TEMPORAL
      setTimeout(() => {
        setClientes([
          { id: 1, nombre: 'Ana', apellido: 'García', dpi: '1234 56789 0101', nit: '123456-7' },
          { id: 2, nombre: 'Luis', apellido: 'Pérez', dpi: '9876 54321 0101', nit: '765432-1' },
          { id: 3, nombre: 'María', apellido: 'López', dpi: '4567 12345 0101', nit: '112233-4' },
        ]);
        setIsLoading(false);
      }, 800);
    };
    fetchClientes();
  }, []);

  const filteredClientes = clientes.filter(c => 
    c.nombre.toLowerCase().includes(search.toLowerCase()) || 
    c.apellido.toLowerCase().includes(search.toLowerCase()) ||
    c.dpi.includes(search)
  );

  const openSlideOver = (clientData) => {
    setSelectedClient(clientData);
    setIsSlideOverOpen(true);
  };

  const closeSlideOver = () => {
    setIsSlideOverOpen(false);
    setSelectedClient(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Directorio Operativo</h1>
          <p className="text-slate-500 mt-1 text-sm">Gestión centralizada de cuentahabientes y perfiles.</p>
        </div>
        
        <button 
          onClick={() => openSlideOver(null)} // null = Creación
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
        >
          <UserPlus className="w-5 h-5" />
          Nuevo Cuentahabiente
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Toolbar buscador */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por nombre o DPI..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-sm font-medium"
            />
          </div>
        </div>

        {/* Tabla Master */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                <th className="p-4 border-b border-slate-100">ID</th>
                <th className="p-4 border-b border-slate-100">Cuentahabiente</th>
                <th className="p-4 border-b border-slate-100">Identificación (DPI)</th>
                <th className="p-4 border-b border-slate-100 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="p-12 text-center text-slate-400">
                    Cargando directorio...
                  </td>
                </tr>
              ) : filteredClientes.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-12 text-center text-slate-400 italic">
                    No se encontraron resultados para la búsqueda.
                  </td>
                </tr>
              ) : (
                filteredClientes.map(cliente => (
                  <tr 
                    key={cliente.id} 
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors group cursor-pointer"
                    onClick={() => openSlideOver(cliente)}
                  >
                    <td className="p-4 text-sm font-bold text-slate-900 font-mono">#{cliente.id}</td>
                    <td className="p-4">
                      <p className="text-sm font-bold text-slate-900">{cliente.nombre} {cliente.apellido}</p>
                      <p className="text-xs text-slate-500">NIT: {cliente.nit}</p>
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-600">{cliente.dpi}</td>
                    <td className="p-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Renderizado condicional del SlideOver */}
      {isSlideOverOpen && (
        <ClientDetailSlideOver 
          client={selectedClient} 
          onClose={closeSlideOver} 
        />
      )}
    </div>
  );
};

export default AdminDashboardView;
