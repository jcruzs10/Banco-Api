import { Outlet, NavLink } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Users, LogOut, ShieldCheck, Home } from 'lucide-react';

const AdminLayout = () => {
  const { logout, user } = useAuthStore();

  const navClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition-all ${
      isActive
        ? 'bg-amber-500 text-slate-900 shadow-sm'
        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Header Admin - Dark Mode para diferenciarlo del Cliente */}
      <header className="bg-slate-950 text-white p-4 shadow-lg sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-xl font-bold flex items-center gap-3">
            <span className="bg-slate-800 p-2 rounded-lg border border-slate-700 text-amber-500">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <span className="tracking-wide">Backoffice <span className="font-light text-slate-400">Banco Central</span></span>
          </h1>
          
          <nav className="flex gap-2 text-sm">
            <NavLink to="/admin" end className={navClass}>
              <Home className="w-4 h-4" />
              Inicio
            </NavLink>
            <NavLink to="/admin/clientes" className={navClass}>
              <Users className="w-4 h-4" />
              Directorio Clientes
            </NavLink>
          </nav>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-200">{typeof user === 'string' ? user : (user?.nombre || 'Administrador')}</p>
              <p className="text-xs text-amber-500 font-medium">Nivel 1 (Super)</p>
            </div>
            <button 
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 p-2 rounded-lg text-white font-bold transition-colors shadow-lg shadow-red-900/20"
              title="Cerrar Sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full relative">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
