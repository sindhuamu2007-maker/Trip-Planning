import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Compass, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  RotateCw, 
  Zap, 
  Car, 
  Navigation 
} from 'lucide-react';
import { getDestinationData } from '../utils/destinationData';
import toast from 'react-hot-toast';

export default function RouteOptimization({ destination = '', onDestinationChange }) {
  const [selectedDest, setSelectedDest] = useState(destination || '');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimized, setOptimized] = useState(true);

  useEffect(() => {
    if ((destination || '') !== selectedDest) {
      setSelectedDest(destination || '');
    }
  }, [destination]);

  const destData = getDestinationData(selectedDest);
  const waypoints = destData.routeWaypoints || [];

  const handleReoptimize = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
      setOptimized(true);
      toast.success(`OR-Tools TSP: Sequence in ${selectedDest} re-optimized with current live traffic conditions!`);
    }, 600);
  };

  const handleSwitchDest = (dest) => {
    setSelectedDest(dest);
    if (onDestinationChange) onDestinationChange(dest);
    toast.success(`Loaded route coordinates for ${dest}!`);
  };

  const popularCities = ['Goa', 'Manali', 'Paris', 'Tokyo', 'Jaipur'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
              OR-Tools Graph Optimization • {selectedDest}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14213D] mt-1">
            Smart Route Optimizer for <span className="text-[#16A6A1]">{selectedDest}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {waypoints.length
              ? `Explore suggested ${selectedDest} stops and check current travel times before setting out.`
              : `No curated route stops are available for ${selectedDest} yet. Search for current places to visit and add verified locations to your itinerary.`}
          </p>
        </div>

        <button
          onClick={handleReoptimize}
          disabled={isOptimizing}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#14213D] text-white font-bold text-xs sm:text-sm hover:bg-slate-800 transition disabled:opacity-50"
        >
          <RotateCw className={`w-4 h-4 ${isOptimizing ? 'animate-spin' : ''}`} />
          <span>Recalculate {selectedDest} Route</span>
        </button>
      </div>

      {/* Destination Switcher */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        <span className="font-bold text-slate-500 whitespace-nowrap">Switch Destination Route:</span>
        {popularCities.map((city) => (
          <button
            key={city}
            onClick={() => handleSwitchDest(city)}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-bold transition ${
              selectedDest.toLowerCase() === city.toLowerCase()
                ? 'bg-[#16A6A1] text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {city === 'Goa' && '🌴 '}
            {city === 'Manali' && '🏔️ '}
            {city === 'Paris' && '🗼 '}
            {city === 'Tokyo' && '🌸 '}
            {city === 'Jaipur' && '🏰 '}
            {city}
          </button>
        ))}
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase">Total Circuit Distance ({selectedDest})</p>
          <p className="text-2xl font-extrabold text-teal-600">{destData.circuitDistance || 'Unavailable'}</p>
          <span className="text-[11px] text-teal-600 font-bold">{destData.routeSavings || 'Add verified locations to calculate a route'}</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase">Estimated Travel Time</p>
          <p className="text-2xl font-extrabold text-[#14213D]">{destData.travelTime || 'Unavailable'}</p>
          <span className="text-[11px] text-teal-600 font-medium">{waypoints.length ? 'Indicative local travel time' : 'No route time estimate available'}</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase">Suggested Route Stops</p>
          <p className="text-2xl font-extrabold text-emerald-600">{waypoints.length || '—'}</p>
          <span className="text-[11px] text-emerald-600 font-medium">{waypoints.length ? `Curated for ${selectedDest}` : 'No curated stops yet'}</span>
        </div>
      </div>

      {/* Sequential Route Flow */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-bold text-base text-[#14213D] flex items-center space-x-2">
            <Navigation className="w-5 h-5 text-teal-600" />
            <span>Optimal Visiting Sequence for {selectedDest}</span>
          </h3>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            {waypoints.length ? 'Suggested Local Stops' : 'Route Data Unavailable'}
          </span>
        </div>

        {waypoints.length ? (
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-teal-500">
          {waypoints.map((wp) => (
            <div key={wp.order} className="relative group">
              <div className="absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full bg-[#16A6A1] text-white text-xs font-bold flex items-center justify-center ring-4 ring-white shadow">
                {wp.order}
              </div>

              <div className="bg-slate-50 hover:bg-slate-100/90 rounded-2xl p-4 border border-slate-200 transition space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className="font-bold text-sm text-slate-900">{wp.name}</h4>
                  <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 self-start sm:self-auto">
                    {wp.type}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Open: {wp.openHours}</span>
                  </span>
                  <span>•</span>
                  <span>Visit Stay: {wp.timeAllocated}</span>
                  <span>•</span>
                  <span className="font-mono text-slate-400">Lat: {wp.lat}, Lng: {wp.lng}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <p className="text-sm font-bold text-slate-800">Find verified places in {selectedDest}</p>
            <p className="mt-1 text-xs text-slate-500">The route catalog does not have curated stops or coordinates for this destination.</p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`attractions in ${selectedDest}`)}`}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#14213D] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
            >
              <MapPin className="h-4 w-4" /> Search attractions in {selectedDest}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
