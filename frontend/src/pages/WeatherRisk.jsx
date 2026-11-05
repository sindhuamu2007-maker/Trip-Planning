import React, { useState, useEffect } from 'react';
import { 
  CloudSun, 
  ShieldAlert, 
  AlertTriangle, 
  Wind, 
  Droplets, 
  Thermometer, 
  CheckCircle2, 
  MapPin, 
  Sun 
} from 'lucide-react';
import { getDestinationData } from '../utils/destinationData';
import toast from 'react-hot-toast';

export default function WeatherRisk({ destination = '', onDestinationChange }) {
  const [selectedDest, setSelectedDest] = useState(destination || '');

  useEffect(() => {
    if ((destination || '') !== selectedDest) {
      setSelectedDest(destination || '');
    }
  }, [destination]);

  const destData = getDestinationData(selectedDest);
  const weather = destData.weatherInfo || {};
  const forecast = weather.forecast || [];
  const hasCuratedWeather = destData.country !== 'Custom Destination';

  const handleSwitchDest = (dest) => {
    setSelectedDest(dest);
    if (onDestinationChange) onDestinationChange(dest);
    toast.success(`Loaded live weather telemetry for ${dest}!`);
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
              Destination Weather Guide • {selectedDest}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14213D] mt-1">
            Weather & Travel Risk Analytics for <span className="text-[#16A6A1]">{selectedDest}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {hasCuratedWeather
              ? `Seasonal travel guidance for ${selectedDest}. Check current local forecasts and advisories before traveling.`
              : `No curated forecast is available for ${selectedDest}. Check current local weather and transit advisories.`}
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full font-bold border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Status in {selectedDest}: {weather.riskLevel || 'Check local advisories'}</span>
        </div>
      </div>

      {/* Destination Quick Switcher */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        <span className="font-bold text-slate-500 whitespace-nowrap">Switch Forecast City:</span>
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

      {/* Risk Dimension Gauges for THIS Destination */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Atmospheric Condition</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              {weather.riskLevel || 'Check advisories'}
            </span>
          </div>
          <p className="text-xl font-extrabold text-[#14213D]">{weather.statusText || 'Weather unavailable'}</p>
          <p className="text-xs text-slate-500 leading-relaxed">
            {weather.weatherSummary || `Check current conditions in ${selectedDest}.`}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Transit & Road Corridors</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${hasCuratedWeather ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
              {hasCuratedWeather ? 'Guide only' : 'Check locally'}
            </span>
          </div>
          <p className="text-xl font-extrabold text-[#14213D]">{hasCuratedWeather ? 'Transit Guide' : 'Transit status unavailable'}</p>
          <p className="text-xs text-slate-500 leading-relaxed">
            {weather.transportSummary || `Check current transit and road updates for ${selectedDest}.`}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Outdoor Excursions</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${hasCuratedWeather ? 'bg-teal-100 text-teal-800' : 'bg-amber-100 text-amber-800'}`}>
              {hasCuratedWeather ? 'Guide only' : 'Verify locally'}
            </span>
          </div>
          <p className="text-xl font-extrabold text-[#14213D]">{hasCuratedWeather ? 'Activity Guidance' : 'Hours unavailable'}</p>
          <p className="text-xs text-slate-500 leading-relaxed">
            {weather.activitySummary || `Verify attraction hours and access with official ${selectedDest} visitor information.`}
          </p>
        </div>
      </div>

      {/* 5-Day Forecast Grid for THIS destination */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-[#14213D] flex items-center space-x-2">
          <CloudSun className="w-5 h-5 text-teal-600" />
          <span>5-Day Meteorological Projections in {selectedDest}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {forecast.map((item, idx) => (
            <div 
              key={idx}
              className="bg-slate-50 rounded-2xl p-4 border border-slate-200/90 text-center space-y-2 hover:border-teal-400 transition"
            >
              <span className="text-[11px] font-bold text-slate-700">{item.day}</span>
              <div className="w-10 h-10 mx-auto rounded-full bg-teal-50 flex items-center justify-center text-[#16A6A1]">
                <Sun className="w-5 h-5" />
              </div>
              <p className="text-lg font-extrabold text-slate-900">{item.temp}</p>
              <p className="text-[11px] text-slate-500 leading-tight">{item.condition}</p>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[10px] font-semibold">
                <span className="text-blue-600">Rain: {item.rainProb}</span>
                <span className={item.risk === 'Low' ? 'text-emerald-600' : 'text-amber-600'}>
                  Risk: {item.risk}
                </span>
              </div>
            </div>
          ))}
          {!forecast.length && (
            <p className="col-span-full rounded-xl bg-amber-50 p-4 text-xs text-amber-900">
              No forecast is available for {selectedDest} in TripSync. Check a current local weather service before traveling.
            </p>
          )}
        </div>
      </div>

      {/* AI Contingency Recommendation Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-800 space-y-3">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5 text-teal-400" />
          <h4 className="font-bold text-sm tracking-wide">AI Contingency Intelligence for {selectedDest}</h4>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {weather.contingencyTip || `Check current local weather and travel advisories for ${selectedDest} before setting out.`}
        </p>
      </div>
    </div>
  );
}
