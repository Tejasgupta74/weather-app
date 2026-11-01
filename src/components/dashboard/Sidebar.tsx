import { useState } from 'react';
import { Home, MapPin, Compass, BarChart3, Settings, RefreshCw } from 'lucide-react';

interface SidebarProps {
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function Sidebar({ onRefresh, isRefreshing = false }: SidebarProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'locations' | 'radar' | 'analytics' | 'settings'>('home');

  const navItems = [
    { id: 'home', icon: Home, label: 'Dashboard' },
    { id: 'locations', icon: MapPin, label: 'Locations' },
    { id: 'radar', icon: Compass, label: 'Radar' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ] as const;

  return (
    <aside className="w-16 md:w-20 bg-[#16181D]/80 border-r border-white/5 flex flex-col items-center justify-between py-6 select-none shrink-0">
      {/* Top Profile Avatar */}
      <div className="flex flex-col items-center space-y-8">
        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 ring-2 ring-white/5 bg-slate-800 flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
            alt="User avatar"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Navigation Icon Stack */}
        <nav className="flex flex-col space-y-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                title={item.label}
                aria-label={item.label}
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-[#282B33] text-white shadow-inner border border-white/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className="w-5 h-5" />
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Refresh Status */}
      <div className="flex flex-col items-center space-y-2 text-center">
        <button
          type="button"
          onClick={onRefresh}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors focus:outline-none"
          title="Refresh forecast data"
          aria-label="Refresh forecast data"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
        </button>
        <span className="text-[10px] font-mono text-slate-500 leading-tight">
          Updated<br />just now
        </span>
      </div>
    </aside>
  );
}
