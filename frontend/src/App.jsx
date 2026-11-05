import React, { useCallback, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AIAgentPlanner from './pages/AIAgentPlanner';
import CollaborativeItinerary from './pages/CollaborativeItinerary';
import RouteOptimization from './pages/RouteOptimization';
import WeatherRisk from './pages/WeatherRisk';
import GroupVoting from './pages/GroupVoting';
import HotelsExplorer from './pages/HotelsExplorer';
import LoginPage from './pages/LoginPage';

function MainAppContent() {
  const { isLoggedIn, user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const tripStorageKey = `tripsync_selected_trip_${user?.id || user?._id || user?.email || 'guest'}`;
  const destinationStorageKey = `tripsync_destination_${user?.id || user?._id || user?.email || 'guest'}`;
  const [selectedTrip, setSelectedTrip] = useState(() => {
    try {
      const savedTrip = localStorage.getItem(tripStorageKey);
      return savedTrip ? JSON.parse(savedTrip) : null;
    } catch (error) {
      console.warn('Could not restore the previously selected trip.', error);
      return null;
    }
  });
  const [currentDestination, setCurrentDestination] = useState(() => {
    const savedDestination = localStorage.getItem(destinationStorageKey);
    return savedDestination || selectedTrip?.destination || '';
  });
  const handleDestinationChange = useCallback((destination) => {
    const nextDestination = typeof destination === 'string' ? destination : '';
    setCurrentDestination(nextDestination);
    if (nextDestination.trim()) {
      localStorage.setItem(destinationStorageKey, nextDestination);
    } else {
      localStorage.removeItem(destinationStorageKey);
    }
  }, [destinationStorageKey]);
  const handleTripSelect = useCallback((trip) => {
    setSelectedTrip(trip);
    if (trip?._id) {
      localStorage.setItem(tripStorageKey, JSON.stringify(trip));
    } else {
      localStorage.removeItem(tripStorageKey);
    }
    const tripDestination = trip?.destination || '';
    setCurrentDestination(tripDestination);
    if (tripDestination) {
      localStorage.setItem(destinationStorageKey, tripDestination);
    } else {
      localStorage.removeItem(destinationStorageKey);
    }
  }, [destinationStorageKey, tripStorageKey]);

  React.useEffect(() => {
    try {
      const savedTrip = localStorage.getItem(tripStorageKey);
      const trip = savedTrip ? JSON.parse(savedTrip) : null;
      setSelectedTrip(trip);
      const savedDestination = localStorage.getItem(destinationStorageKey);
      setCurrentDestination(savedDestination || trip?.destination || '');
    } catch (error) {
      console.warn('Could not restore the previously selected trip.', error);
      setSelectedTrip(null);
      setCurrentDestination('');
      localStorage.removeItem(tripStorageKey);
      localStorage.removeItem(destinationStorageKey);
    }
  }, [destinationStorageKey, tripStorageKey]);

  // If user is not logged in, ask for login before reaching the dashboard
  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={() => setActiveTab('dashboard')} />;
  }

  const handleTripSave = (newTrip) => {
    handleTripSelect(newTrip);
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#14213D] flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Responsive Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Dynamic Page Views */}
      <main className="flex-1 pb-16">
        {activeTab === 'dashboard' && (
          <Dashboard 
            setActiveTab={setActiveTab} 
            onSelectTrip={handleTripSelect}
          />
        )}

        {activeTab === 'ai-planner' && (
          <AIAgentPlanner 
            onSaveTrip={handleTripSave} 
            setActiveTab={setActiveTab} 
            destination={currentDestination}
            onDestinationChange={handleDestinationChange}
          />
        )}

        {activeTab === 'hotels' && (
          <HotelsExplorer 
            activeDestination={currentDestination}
            onDestinationChange={handleDestinationChange}
            tripDuration={selectedTrip?.durationDays || 5}
            totalBudget={selectedTrip?.budget?.total || 40000}
            onSelectHotel={(hotel, totalCost) => {
              setSelectedTrip((trip) => trip ? {
                ...trip,
                selectedHotel: hotel,
                accommodationCost: totalCost
              } : trip);
            }}
          />
        )}

        {activeTab === 'itinerary' && (
          <CollaborativeItinerary 
            activeTrip={selectedTrip} 
            destination={currentDestination}
            onDestinationChange={handleDestinationChange}
          />
        )}

        {activeTab === 'route' && (
          <RouteOptimization 
            destination={currentDestination}
            onDestinationChange={handleDestinationChange}
          />
        )}

        {activeTab === 'risk' && (
          <WeatherRisk 
            destination={currentDestination}
            onDestinationChange={handleDestinationChange}
          />
        )}

        {activeTab === 'voting' && (
          <GroupVoting destination={currentDestination} />
        )}

        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto py-12 px-4">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-[#14213D]">User Profile</h2>
              <div className="flex items-center space-x-4">
                <img src={user?.avatar} alt="avatar" className="w-16 h-16 rounded-full border-2 border-teal-500 object-cover" />
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">{user?.name}</h3>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="px-4 py-2 bg-[#16A6A1] text-white rounded-xl text-xs font-bold"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Global Footer */}
      <footer className="bg-[#14213D] text-slate-400 text-xs py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-white tracking-tight">TripSync AI</span>
            <span>—</span>
            <span className="text-teal-400">Plan Together. Travel Smarter. Explore Better.</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <span className="flex items-center space-x-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Logged in as {user?.name || user?.email}</span>
            </span>
            <span>•</span>
            <button 
              onClick={() => setActiveTab('ai-planner')}
              className="text-teal-300 hover:text-white font-semibold underline"
            >
              Plan with AI
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
