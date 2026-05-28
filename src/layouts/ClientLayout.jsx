import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LayoutDashboard, Send, Receipt, LogOut, UserCircle } from 'lucide-react';

const ClientLayout = () => {
  const { logout, user } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);

  // Helper para clases activas en el sidebar
  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold ${
      isActive
        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Fijo */}
      <aside className="w-64 bg-slate-950 text-white flex flex-col fixed inset-y-0 left-0 z-40 shadow-2xl">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-black flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 10.5L12 4l9 6.5"></path>
                <path d="M5 10.5V20h14v-9.5"></path>
                <path d="M9.5 20v-6h5v6"></path>
              </svg>
            </span>
            <span>CENTRAL</span>
          </h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavLink to="/cliente" end className={navClass}>
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/cliente/transferencias" className={navClass}>
            <Send className="w-5 h-5" />
            <span>Transferir</span>
          </NavLink>
          <NavLink to="/cliente/pagos" className={navClass}>
            <Receipt className="w-5 h-5" />
            <span>Pagar Servicios</span>
          </NavLink>
        </nav>

        {/* User Profile Dropdown en el fondo del sidebar */}
        <div className="p-4 border-t border-slate-800 relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center justify-between w-full p-3 bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors border border-slate-800"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-blue-200">
                <UserCircle className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold truncate text-slate-200">
                  {typeof user === 'string' ? user : (user?.nombre || 'Mi Perfil')}
                </p>
                <p className="text-xs text-slate-500">Cliente</p>
              </div>
            </div>
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute bottom-20 left-4 right-4 bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden z-50">
              <button 
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-700 transition-colors font-semibold text-sm"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8 md:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ClientLayout;
