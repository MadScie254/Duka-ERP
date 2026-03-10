import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Users, Settings, Menu } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/appStore';

const navItems = [
  { name: 'Dashboard', to: '/', icon: LayoutDashboard },
  { name: 'POS', to: '/pos', icon: ShoppingCart },
  { name: 'Inventory', to: '/inventory', icon: Package },
  { name: 'Customers & Debt', to: '/customers', icon: Users },
  { name: 'Settings', to: '/settings', icon: Settings },
];

export default function AppLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const activeShop = useAppStore((state) => state.activeShop);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="font-bold text-xl text-emerald-600">DukaERP</div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-white border-r border-gray-200 w-64 flex-shrink-0 flex flex-col fixed md:sticky top-0 h-screen z-40 transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="p-6 hidden md:block">
          <div className="font-bold text-2xl text-emerald-600">DukaERP</div>
          <div className="text-sm text-gray-500 mt-1">{activeShop?.name}</div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-colors",
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-gray-700 hover:bg-gray-100"
                )
              }
            >
              <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
              {item.name}
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
              {activeShop?.ownerName.charAt(0)}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{activeShop?.ownerName}</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-8 pb-24 md:pb-8">
        <Outlet />
      </main>
      
      {/* Mobile Bottom Nav (Optional, but good for POS/Dashboard quick access) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2 pb-safe z-40">
        {navItems.slice(0, 4).map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center p-2 text-xs font-medium",
                isActive ? "text-emerald-600" : "text-gray-500"
              )
            }
          >
            <item.icon className="w-6 h-6 mb-1" />
            <span className="truncate w-16 text-center">{item.name.split(' ')[0]}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
