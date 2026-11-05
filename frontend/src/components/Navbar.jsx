import React from 'react';
import { 
  Compass, 
  Sparkles, 
  LayoutDashboard, 
  Calendar, 
  Map, 
  ShieldAlert, 
  Vote, 
  Building2,
  LogOut, 
  UserCircle 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ activeTab, setActiveTab, currentDestination = 'Goa' }) {
  const { user, logout, isLoggedIn } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ai-planner', label: 'Plan with AI', icon: Sparkles, highlight: true },
    { id: 'hotels', label: 'Surrounding Hotels', icon: Building2 },
    { id: 'itinerary', label: 'Shared Itinerary', icon: Calendar },
    { id: 'route', label: 'Route Optimizer', icon: Map },
    { id: 'risk', label: 'Weather & Risk', icon: ShieldAlert },
    { id: 'voting', label: 'Group Voting', icon: Vote },
  ];

  return (
    <header className="bg-[#14213D] text-white border-b border-slate-700/60 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#16A6A1] to-[#FF8066] flex items-center justify-center shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6 text-white group-hover:rotate-45 transition-transform duration-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-teal-300 to-coral-400 bg-clip-text text-transparent">
                  TripSync AI
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Live
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">Plan Together. Travel Smarter.</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? item.highlight
                        ? 'bg-gradient-to-r from-[#16A6A1] to-[#147a77] text-white shadow-md shadow-teal-500/20'
                        : 'bg-white/10 text-white shadow-sm'
                      : item.highlight
                      ? 'bg-teal-500/10 text-teal-300 hover:bg-teal-500/20 border border-teal-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${item.highlight && !isActive ? 'text-[#FF8066]' : ''}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Profile / Auth Area */}
          <div className="flex items-center space-x-3">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <div 
                  onClick={() => setActiveTab('profile')}
                  className="flex items-center space-x-2 cursor-pointer bg-slate-800/80 hover:bg-slate-700/80 px-2.5 py-1 rounded-full border border-slate-700 transition"
                >
                  <img 
                    src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"} 
                    alt="avatar" 
                    className="w-7 h-7 rounded-full object-cover border border-teal-400"
                  />
                  <span className="text-xs font-medium text-slate-200 hidden sm:inline-block max-w-[100px] truncate">
                    {user?.name || 'Traveler'}
                  </span>
                </div>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveTab('login')}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-[#16A6A1] to-[#FF8066] text-white text-xs font-bold rounded-lg shadow hover:opacity-95 transition"
              >
                <UserCircle className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center space-x-1 py-2 overflow-x-auto border-t border-slate-800 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap ${
                  isActive
                    ? 'bg-[#16A6A1] text-white'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
