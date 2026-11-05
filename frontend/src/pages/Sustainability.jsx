import React from 'react';
import { 
  Leaf, 
  Car, 
  Compass, 
  Award, 
  CheckCircle2, 
  TrendingDown, 
  TreePine, 
  ArrowRight 
} from 'lucide-react';

export default function Sustainability() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Eco-Travel Intelligence
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14213D] mt-1">
            Carbon Footprint & Sustainability Planner
          </h1>
          <p className="text-xs text-slate-500">
            Documented emissions factors tracking transit types, stays, and lower-impact local experiences.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full font-bold border border-emerald-200">
          <Award className="w-4 h-4 text-emerald-600" />
          <span>Eco-Rating: A- (Low Impact)</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase">Estimated Trip Emissions</p>
          <p className="text-2xl font-extrabold text-emerald-600">114 kg CO2e</p>
          <span className="text-[11px] text-slate-500">28.5 kg CO2e per traveler</span>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase">Emissions Avoided via AI Routing</p>
          <p className="text-2xl font-extrabold text-teal-600">32.6 kg CO2e</p>
          <span className="text-[11px] text-emerald-600 font-bold">✓ 22% less road deadhead</span>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase">Trees Equivalent to Offset</p>
          <p className="text-2xl font-extrabold text-[#14213D]">5 Saplings</p>
          <span className="text-[11px] text-slate-500">Neutralizing full holiday impact</span>
        </div>
      </div>

      {/* Sustainable Recommendations */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-[#14213D] flex items-center space-x-2">
          <TreePine className="w-5 h-5 text-emerald-600" />
          <span>AI Green Travel Recommendations</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-emerald-50/60 rounded-xl p-4 border border-emerald-200/80 space-y-2">
            <h4 className="font-bold text-sm text-emerald-900 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Use Mandovi River Passenger Ferries</span>
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Crossing between Betim and Panaji via electric/passenger ferry produces 88% fewer emissions than taking long bridge vehicular detours.
            </p>
            <span className="inline-block text-emerald-700 font-bold">Saves 4.2 kg CO2 per trip</span>
          </div>

          <div className="bg-emerald-50/60 rounded-xl p-4 border border-emerald-200/80 space-y-2">
            <h4 className="font-bold text-sm text-emerald-900 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Support Organic Heritage Spice Plantations</span>
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Visiting eco-certified Sahakari spice farms directly funds reforestation and traditional regenerative permaculture in Western Ghats.
            </p>
            <span className="inline-block text-emerald-700 font-bold">100% Local Community Impact</span>
          </div>
        </div>
      </div>
    </div>
  );
}
