import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  UserCheck, 
  Building2, 
  Map, 
  Users, 
  CheckCircle2 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage({ onLoginSuccess }) {
  const [isRegisterMode, setIsRegisterMode] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const cleanEmail = email.trim() || 'traveler@tripsync.ai';
    const cleanPassword = password || '123456';
    const cleanName = name.trim() || cleanEmail.split('@')[0] || 'Traveler';

    await login(cleanEmail, cleanPassword, cleanName);
    setLoading(false);
    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  const handleQuickGuestLogin = async () => {
    setLoading(true);
    await login('guest@tripsync.ai', 'guest123', 'Guest User');
    setLoading(false);
    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-teal-500 selection:text-white">
      <div className="max-w-4xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: Brand Value Proposition & Features Showcase */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#16A6A1] to-[#FF8066] flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Compass className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-[#14213D] via-teal-700 to-[#FF8066] bg-clip-text text-transparent">
                TripSync AI
              </span>
              <p className="text-xs text-slate-500 font-medium">Plan Together. Travel Smarter. Explore Better.</p>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#14213D] leading-tight">
              Sign In to Start Your <br />
              <span className="text-[#16A6A1]">Smart Travel Workspace.</span>
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed">
              Create an account with any email to unlock autonomous AI itinerary planning, 
              surrounding hotels with budget intelligence, real-time group collaboration, 
              and OR-Tools route optimization.
            </p>
          </div>

          {/* Feature Highlights Checklist */}
          <div className="space-y-2.5 pt-2 font-medium text-xs text-slate-700">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
              <span>Multi-Agent AI Travel Planner (Day-by-day customized plans)</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
              <span>Surrounding Hotels & Accommodations with Budget Filters</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
              <span>Real-Time Group Itinerary & Live Chat via WebSockets</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
              <span>ML Expense Anomaly Detection & Bill Settlement</span>
            </div>
          </div>
        </div>

        {/* Right Side: Simple & Permissive Auth Form Card */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xl space-y-6">
          
          {/* Tabs: Create Account vs Sign In */}
          <div className="flex items-center p-1 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setIsRegisterMode(true)}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
                isRegisterMode 
                  ? 'bg-white text-[#14213D] shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
            <button
              type="button"
              onClick={() => setIsRegisterMode(false)}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
                !isRegisterMode 
                  ? 'bg-white text-[#14213D] shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
          </div>

          {/* Frictionless Dummy Email Alert */}
          <div className="bg-teal-50/80 border border-teal-200 rounded-2xl p-3.5 text-xs text-teal-900 flex items-start space-x-2.5">
            <ShieldCheck className="w-4 h-4 text-[#16A6A1] flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Frictionless Setup:</strong> Enter <strong>any email and password</strong> (dummy emails like <code>user@example.com</code> work instantly with zero verification).
            </p>
          </div>

          {/* 1-Click Guest Access */}
          <button
            type="button"
            onClick={handleQuickGuestLogin}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
          >
            <UserCheck className="w-4 h-4 text-teal-400" />
            <span>⚡ 1-Click Instant Guest Access</span>
          </button>

          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <div className="flex-1 border-t border-slate-200"></div>
            <span>or continue with your credentials</span>
            <div className="flex-1 border-t border-slate-200"></div>
          </div>

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {isRegisterMode && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Username</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your username (e.g. explorer_01)"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A6A1] text-slate-800"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. traveler@gmail.com (any email works)"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A6A1] text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••••• (any password works)"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A6A1] text-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-gradient-to-r from-[#16A6A1] to-[#FF8066] text-white font-bold text-sm shadow-md hover:opacity-95 transition disabled:opacity-50"
            >
              <span>{isRegisterMode ? 'Create Account & Open Dashboard' : 'Sign In & Open Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
