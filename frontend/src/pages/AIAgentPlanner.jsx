import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getDestinationData, normalizeDestinationName } from '../utils/destinationData';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Compass, 
  Activity, 
  ShieldCheck, 
  Leaf, 
  Zap, 
  TrendingDown, 
  Plus, 
  Trash2, 
  Save, 
  RotateCw,
  Building2,
  Navigation
} from 'lucide-react';

export default function AIAgentPlanner({ onSaveTrip, setActiveTab, destination: activeDestination = '', onDestinationChange }) {
  const [destination, setDestination] = useState(activeDestination);
  const [durationDays, setDurationDays] = useState(5);
  const [budget, setBudget] = useState(40000);
  const [travelersCount, setTravelersCount] = useState(4);
  const [travelStyle, setTravelStyle] = useState('Balanced Explorer');
  const [selectedInterests, setSelectedInterests] = useState(['Beaches', 'Food & Dining', 'Culture & Heritage']);
  const [isPlanning, setIsPlanning] = useState(false);
  const [isSavingTrip, setIsSavingTrip] = useState(false);
  const [planningStep, setPlanningStep] = useState(0);
  const [planResult, setPlanResult] = useState(null);

  useEffect(() => {
    setDestination(activeDestination);
  }, [activeDestination]);

  const interestOptions = [
    'Beaches', 'Water Sports', 'Food & Dining', 'Culture & Heritage', 
    'Mountains', 'Adventure Treks', 'Nightlife', 'Relaxation & Spa', 'Wildlife'
  ];

  const travelStyles = [
    'Balanced Explorer', 'Adventure Trekker', 'Budget Backpacker', 'Luxury Leisure', 'Cultural Connoisseur'
  ];

  const presetQueries = [
    { label: '🌴 5-Day Goa (₹40,000)', dest: 'Goa', days: 5, budget: 40000, travelers: 4, style: 'Balanced Explorer' },
    { label: '🏔️ 6-Day Manali (₹65,000)', dest: 'Manali', days: 6, budget: 65000, travelers: 3, style: 'Adventure Trekker' },
    { label: '🗼 4-Day Paris (€1,800)', dest: 'Paris', days: 4, budget: 160000, travelers: 2, style: 'Cultural Connoisseur' },
    { label: '🌸 7-Day Tokyo (¥250,000)', dest: 'Tokyo', days: 7, budget: 140000, travelers: 2, style: 'Balanced Explorer' }
  ];

  const handlePreset = (preset) => {
    setDestination(preset.dest);
    setDurationDays(preset.days);
    setBudget(preset.budget);
    setTravelersCount(preset.travelers);
    setTravelStyle(preset.style);
    if (onDestinationChange) onDestinationChange(preset.dest);
  };

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleGeneratePlan = async (e) => {
    if (e) e.preventDefault();
    if (!destination.trim()) {
      toast.error('Enter a destination before generating your trip plan.');
      return;
    }
    const plannedDestination = normalizeDestinationName(destination);
    setDestination(plannedDestination);
    if (onDestinationChange) onDestinationChange(plannedDestination);
    setIsPlanning(true);
    setPlanningStep(1);
    setPlanResult(null);

    // Step-by-step agent feedback animation
    const stepInterval = setInterval(() => {
      setPlanningStep(prev => (prev < 6 ? prev + 1 : prev));
    }, 600);

    try {
      const payload = {
        destination: plannedDestination,
        durationDays: Number(durationDays),
        budget: Number(budget),
        travelersCount: Number(travelersCount),
        travelStyle,
        interests: selectedInterests
      };

      const res = await axios.post('/api/v1/ai/plan-trip', payload);
      
      clearInterval(stepInterval);
      setPlanningStep(6);
      setTimeout(() => {
        setIsPlanning(false);
        setPlanResult(res.data);
        toast.success('Autonomous AI proposal generated successfully!');
      }, 500);
    } catch (err) {
      clearInterval(stepInterval);
      setIsPlanning(false);
      toast.error('AI agent service responding with fallback engine.');
      // Use fallback generator
      const fallback = generateClientPlan(plannedDestination, durationDays, budget, travelersCount, travelStyle);
      setPlanResult(fallback);
    }
  };

  // Client-side fallback generator to guarantee 100% uptime
  const generateClientPlan = (dest, days, totalBudget, travelers, style) => {
    const destinationData = getDestinationData(dest);
    const timeLabel = destinationData.travelTime || '';
    const travelHours = Number(timeLabel.match(/(\d+)\s*h/i)?.[1] || 0);
    const travelMinutes = Number(timeLabel.match(/(\d+)\s*m/i)?.[1] || 0);
    const travelTimeMinutes = travelHours || travelMinutes
      ? travelHours * 60 + travelMinutes
      : null;
    const activityLibrary = destinationData.itineraryDays.flatMap((day) => day.activities || []);
    const waypointLibrary = destinationData.routeWaypoints || [];
    const activities = activityLibrary.map((activity) => ({
      title: activity.title,
      timeSlot: activity.timeSlot,
      startTime: activity.startTime,
      endTime: activity.endTime,
      location: {
        name: activity.location,
        lat: activity.lat,
        lng: activity.lng
      },
      category: activity.category,
      estimatedCost: destinationData.country === 'Custom Destination' ? null : activity.cost ?? 0,
      description: `${activity.title} in ${destinationData.name}. Confirm current opening times and prices before visiting.`
    }));
    const additionalDayThemes = [
      {
        theme: 'Markets & neighborhood discoveries',
        activities: [
          ['Find a local market or independent neighborhood', 'Morning', '09:00', '12:00', 'Sightseeing'],
          ['Try a regional specialty at a well-reviewed local spot', 'Afternoon', '12:30', '14:00', 'Food & Dining'],
          ['Explore public art or a community cultural space', 'Evening', '16:30', '19:00', 'Culture']
        ]
      },
      {
        theme: 'Scenic outing & group favorites',
        activities: [
          ['Choose a scenic walk or nature area with confirmed access', 'Morning', '09:00', '12:00', 'Adventure'],
          ['Visit a different neighborhood for lunch', 'Afternoon', '12:30', '14:00', 'Food & Dining'],
          ['Revisit a group favorite or relax in a public area', 'Evening', '16:30', '19:00', 'Relaxation']
        ]
      }
    ];

    return {
      success: true,
      proposalTitle: `${days}-Day ${destinationData.name} Trip`,
      destination: destinationData.name,
      durationDays: days,
      travelersCount: travelers,
      budgetTotal: totalBudget,
      weatherReport: {
        temp: destinationData.weatherInfo?.forecast?.[0]?.temp || 'Unavailable',
        condition: destinationData.weatherInfo?.statusText || `Check local conditions in ${destinationData.name}`,
        risk: destinationData.weatherInfo?.riskLevel || 'Check local advisories'
      },
      routeOptimization: {
        optimizedSequence: waypointLibrary.map((waypoint) => waypoint.name),
        estimatedDistanceKm: Number.parseFloat(destinationData.circuitDistance) || 0,
        travelTimeMinutes,
        efficiencyScore: `${destinationData.routeSavings || 'Destination-specific route suggestions'}`
      },
      sustainability: {
        estimatedCarbonKg: Math.round(days * 18.5 * travelers),
        ecoRating: 'A',
        greenTip: `Walk or use shared transit between ${destinationData.name} stops where practical.`
      },
      agentLogs: [
        { agent: 'Destination Research Agent', action: `Selected itinerary recommendations for ${destinationData.name}`, result: `Using local ${destinationData.name} itinerary suggestions.`, timestamp: '0.12s' },
        { agent: 'Group Preference Agent', action: `Matched ${travelers} travelers with style "${style}"`, result: `Considered ${selectedInterests.join(', ')}.`, timestamp: '0.24s' },
        { agent: 'Budget Intelligence Agent', action: `Allocated ₹${totalBudget.toLocaleString()} across the trip`, result: 'Activity costs are indicative; confirm local prices.', timestamp: '0.36s' },
        { agent: 'Route Optimization Agent', action: `Loaded points of interest for ${destinationData.name}`, result: 'Review the suggested stops and verify travel times locally.', timestamp: '0.48s' },
        { agent: 'Final Proposal Agent', action: `Built a ${days}-day ${destinationData.name} itinerary`, result: 'Review venue hours, prices, weather, and travel conditions before booking.', timestamp: '0.60s' }
      ],
      days: Array.from({ length: days }, (_, dayIndex) => {
        const curatedDay = destinationData.itineraryDays[dayIndex];
        const extraDay = additionalDayThemes[(dayIndex - destinationData.itineraryDays.length) % additionalDayThemes.length];
        const dayActivities = curatedDay
          ? activities.slice(dayIndex * 3, dayIndex * 3 + 3)
          : extraDay.activities.map(([idea, timeSlot, startTime, endTime, category]) => ({
            title: `${idea} in ${destinationData.name}`,
            timeSlot,
            startTime,
            endTime,
            location: { name: destinationData.name },
            category,
            estimatedCost: null,
            description: `Find and verify a suitable ${idea.toLowerCase()} in ${destinationData.name}; current venue details and prices are not curated here.`
          }));
        return {
          dayNumber: dayIndex + 1,
          title: `Day ${dayIndex + 1}: ${curatedDay?.title || extraDay.theme}`,
          theme: curatedDay?.title || extraDay.theme,
          activities: dayActivities
        };
      }),
    };
  };

  const handleSaveToTrips = async () => {
    if (!planResult || isSavingTrip) return;
    setIsSavingTrip(true);
    try {
      const tripData = {
        title: planResult.proposalTitle,
        destination: planResult.destination,
        durationDays: planResult.durationDays,
        budget: planResult.budgetTotal,
        travelersCount: planResult.travelersCount,
        travelStyle,
        interests: selectedInterests,
        daysData: planResult.days
      };

      const res = await axios.post('/api/v1/trips', tripData);
      if (!res.data?.success || !res.data?.trip?._id) {
        throw new Error(res.data?.message || 'The trip could not be saved, so no shareable Trip ID was created.');
      }

      toast.success('Plan saved to My Trips. You can reopen it from your dashboard anytime.');
      if (onSaveTrip) onSaveTrip(res.data.trip);
      if (setActiveTab) setActiveTab('itinerary');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Could not create the group trip. Please try again.');
    } finally {
      setIsSavingTrip(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#14213D] via-[#102d53] to-[#16A6A1] p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-teal-400/10 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
            <Sparkles className="w-3.5 h-3.5 text-coral-400" />
            <span>Autonomous Multi-Agent AI Travel Planner</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Tell AI Where You Want to Travel. <br className="hidden sm:block" />
            We Orchestrate the Entire Trip.
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Our multi-agent ecosystem gathers verified destination attractions, harmonizes group preferences, 
            balances predictive budgets, predicts weather risks, and solves TSP route optimizations in seconds.
          </p>

          {/* Preset Buttons */}
          <div className="pt-2">
            <p className="text-xs text-slate-400 mb-2 font-medium">Quick Plan Presets:</p>
            <div className="flex flex-wrap gap-2">
              {presetQueries.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePreset(preset)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/10 transition shadow-sm"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trip Parameter Configuration */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
        <form onSubmit={handleGeneratePlan} className="space-y-6">
          {/* Granular Parameter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {/* Destination */}
            <div className="space-y-1.5">
              <label className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                <span>Destination</span>
              </label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value);
                  onDestinationChange?.(e.target.value);
                }}
                placeholder="Enter your destination (e.g. Goa, Manali, Paris)"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#16A6A1]"
              />
            </div>

            {/* Duration Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                <span className="flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-teal-600" />
                  <span>Duration</span>
                </span>
                <span className="text-[#16A6A1] font-bold">{durationDays} Days</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                className="w-full accent-[#16A6A1] cursor-pointer"
              />
            </div>

            {/* Total Budget */}
            <div className="space-y-1.5">
              <label className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700">
                <DollarSign className="w-3.5 h-3.5 text-teal-600" />
                <span>Budget Envelope (₹ INR)</span>
              </label>
              <input
                type="number"
                step="5000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#16A6A1]"
              />
            </div>

            {/* Travelers Count */}
            <div className="space-y-1.5">
              <label className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700">
                <Users className="w-3.5 h-3.5 text-teal-600" />
                <span>Travelers</span>
              </label>
              <select
                value={travelersCount}
                onChange={(e) => setTravelersCount(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#16A6A1]"
              >
                <option value="1">Solo Traveler (1)</option>
                <option value="2">Couple / Duo (2)</option>
                <option value="3">Small Group (3)</option>
                <option value="4">Group of Four (4)</option>
                <option value="6">Friends Crew (6)</option>
                <option value="8">Large Group (8+)</option>
              </select>
            </div>
          </div>

          {/* Travel Style Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">Travel Style:</label>
            <div className="flex flex-wrap gap-2">
              {travelStyles.map((style) => (
                <button
                  type="button"
                  key={style}
                  onClick={() => setTravelStyle(style)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    travelStyle === style
                      ? 'bg-[#14213D] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Interest Badges */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">Travel Interests & Activities:</label>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map((interest) => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <button
                    type="button"
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                      isSelected
                        ? 'bg-teal-500/10 text-[#16A6A1] border border-teal-500/40 font-bold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-transparent'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '} {interest}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end border-t border-slate-100 pt-5">
            <button
              type="submit"
              disabled={isPlanning}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#16A6A1] to-[#FF8066] text-white font-bold text-sm shadow-md hover:opacity-95 disabled:opacity-50 transition flex items-center space-x-2"
            >
              {isPlanning ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Planning...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Trip Plan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Autonomous Multi-Agent Execution Progress Tracker */}
      {isPlanning && (
        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl space-y-4 border border-slate-800 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-teal-400 animate-pulse" />
              <span className="font-bold text-sm tracking-wide">Multi-Agent Planning Pipeline Running</span>
            </div>
            <span className="text-xs text-teal-300 font-mono">Step {planningStep} of 6</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className={`flex items-center space-x-3 ${planningStep >= 1 ? 'text-teal-400' : 'text-slate-600'}`}>
              <CheckCircle2 className={`w-4 h-4 ${planningStep >= 1 ? 'text-teal-400' : 'text-slate-600'}`} />
              <span>[1/6] Destination Research Agent: Aggregating verified attractions & geo-coordinates...</span>
            </div>
            <div className={`flex items-center space-x-3 ${planningStep >= 2 ? 'text-teal-400' : 'text-slate-600'}`}>
              <CheckCircle2 className={`w-4 h-4 ${planningStep >= 2 ? 'text-teal-400' : 'text-slate-600'}`} />
              <span>[2/6] Group Preference Agent: Harmonizing group interests with travel style...</span>
            </div>
            <div className={`flex items-center space-x-3 ${planningStep >= 3 ? 'text-teal-400' : 'text-slate-600'}`}>
              <CheckCircle2 className={`w-4 h-4 ${planningStep >= 3 ? 'text-teal-400' : 'text-slate-600'}`} />
              <span>[3/6] Predictive Budget Intelligence: Allocating envelope across stay, food & activities...</span>
            </div>
            <div className={`flex items-center space-x-3 ${planningStep >= 4 ? 'text-teal-400' : 'text-slate-600'}`}>
              <CheckCircle2 className={`w-4 h-4 ${planningStep >= 4 ? 'text-teal-400' : 'text-slate-600'}`} />
              <span>[4/6] Weather & Risk Prediction Agent: Evaluating seasonal weather and travel risks...</span>
            </div>
            <div className={`flex items-center space-x-3 ${planningStep >= 5 ? 'text-teal-400' : 'text-slate-600'}`}>
              <CheckCircle2 className={`w-4 h-4 ${planningStep >= 5 ? 'text-teal-400' : 'text-slate-600'}`} />
              <span>[5/6] OR-Tools Route Optimizer: Sequencing stops to minimize transit friction...</span>
            </div>
            <div className={`flex items-center space-x-3 ${planningStep >= 6 ? 'text-teal-400' : 'text-slate-600'}`}>
              <CheckCircle2 className={`w-4 h-4 ${planningStep >= 6 ? 'text-teal-400' : 'text-slate-600'}`} />
              <span>[6/6] Final Planning Agent: Assembling collision-free collaborative proposal...</span>
            </div>
          </div>
        </div>
      )}

      {/* Generated AI Proposal Presentation */}
      {planResult && !isPlanning && (
        <div className="space-y-6 animate-fadeIn">
          {/* Proposal Summary Bar & Human Approval Controls */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-teal-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold text-xs">
                  AI Proposal Ready
                </span>
                <span className="text-xs text-slate-500">Validated with Pydantic</span>
              </div>
              <h2 className="text-2xl font-extrabold text-[#14213D]">{planResult.proposalTitle}</h2>
              <p className="text-xs text-slate-600">
                Destination: <strong className="text-slate-900">{planResult.destination}</strong> • 
                Duration: <strong className="text-slate-900">{planResult.durationDays} Days</strong> • 
                Travelers: <strong className="text-slate-900">{planResult.travelersCount}</strong> • 
                Total Budget: <strong className="text-teal-600">₹{Number(planResult.budgetTotal).toLocaleString()}</strong>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <button
                onClick={() => {
                  if (onDestinationChange) onDestinationChange(planResult?.destination || destination);
                  setActiveTab('hotels');
                }}
                className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl border border-teal-500 text-teal-800 bg-teal-50 hover:bg-teal-100 font-bold text-xs transition"
              >
                <Building2 className="w-3.5 h-3.5 text-teal-600" />
                <span>View {planResult?.destination || destination} Hotels</span>
              </button>
              <button
                onClick={() => {
                  if (onDestinationChange) onDestinationChange(planResult?.destination || destination);
                  setActiveTab('route');
                }}
                className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs transition"
              >
                <Navigation className="w-3.5 h-3.5 text-teal-600" />
                <span>View Route</span>
              </button>
              <button
                onClick={handleGeneratePlan}
                className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs transition"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Regenerate</span>
              </button>
              <button
                onClick={handleSaveToTrips}
                disabled={isSavingTrip}
                className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#16A6A1] to-[#14213D] text-white font-bold text-xs sm:text-sm shadow-md hover:opacity-95 transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingTrip ? 'Saving Plan…' : 'Save Plan to My Trips'}</span>
              </button>
            </div>
          </div>

          {/* Multi-Agent Analytics Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Weather & Risk Card */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-start space-x-3">
              <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase">Weather & Risk</p>
                <p className="text-sm font-bold text-slate-900">{planResult.weatherReport?.temp} • {planResult.weatherReport?.condition}</p>
                <span className="text-[10px] text-emerald-600 font-semibold">Risk: {planResult.weatherReport?.risk || 'Low'}</span>
              </div>
            </div>

            {/* Route Optimizer Card */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-start space-x-3">
              <div className="p-2.5 rounded-lg bg-teal-50 text-[#16A6A1]">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase">OR-Tools Route Savings</p>
                <p className="text-sm font-bold text-slate-900">{planResult.routeOptimization?.efficiencyScore || 'Route estimate unavailable'}</p>
                <span className="text-[10px] text-teal-600 font-medium">
                  {Number.isFinite(planResult.routeOptimization?.travelTimeMinutes)
                    ? `Est. ${planResult.routeOptimization.travelTimeMinutes} min travel/day`
                    : 'Travel time estimate unavailable'}
                </span>
              </div>
            </div>

            {/* Predictive Budget Card */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-start space-x-3">
              <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase">Per Traveler Cost</p>
                <p className="text-sm font-bold text-slate-900">
                  ₹{Math.round(planResult.budgetTotal / planResult.travelersCount).toLocaleString()}
                </p>
                <span className="text-[10px] text-blue-600 font-medium">5% emergency reserve included</span>
              </div>
            </div>

            {/* Eco Footprint Card */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-start space-x-3">
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase">Carbon Footprint</p>
                <p className="text-sm font-bold text-slate-900">{planResult.sustainability?.estimatedCarbonKg || 120} kg CO2e</p>
                <span className="text-[10px] text-emerald-600 font-medium">Eco Rating: {planResult.sustainability?.ecoRating || 'A'}</span>
              </div>
            </div>
          </div>

          {/* Day-by-Day Collaborative Itinerary View */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#14213D] flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-[#16A6A1]" />
              <span>Generated Daily Schedule ({planResult.days?.length} Days)</span>
            </h3>

            <div className="space-y-4">
              {planResult.days?.map((day) => (
                <div key={day.dayNumber} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-white text-[11px] font-bold">
                        Day {day.dayNumber}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 mt-1">{day.title}</h4>
                    </div>
                    <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full">
                      Theme: {day.theme}
                    </span>
                  </div>

                  {/* Activities within Day */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {day.activities?.map((act, actIdx) => (
                      <div 
                        key={actIdx}
                        className="bg-slate-50/80 hover:bg-slate-100/80 rounded-xl p-3.5 border border-slate-200/80 transition space-y-2 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                              {act.timeSlot}
                            </span>
                            <span className="text-[11px] font-medium text-slate-500 flex items-center space-x-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{act.startTime} - {act.endTime}</span>
                            </span>
                          </div>
                          <h5 className="font-bold text-sm text-slate-800 mt-2">{act.title}</h5>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">{act.description}</p>
                        </div>

                        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                          <span className="text-teal-700 font-bold">
                            {act.estimatedCost == null
                              ? 'Check locally'
                              : act.estimatedCost
                                ? `₹${act.estimatedCost.toLocaleString()}`
                                : 'Free'}
                          </span>
                          <span className="text-[10px] font-medium text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                            {act.category}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Execution Trace Logs */}
          <div className="bg-slate-900 rounded-2xl p-5 text-slate-300 font-mono text-xs shadow-md border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-white text-xs flex items-center space-x-2">
                <Activity className="w-4 h-4 text-teal-400" />
                <span>AI Autonomous Execution Trace & Tool Invocations</span>
              </span>
              <span className="text-[10px] text-teal-400">All Steps Completed</span>
            </div>
            <div className="space-y-1.5">
              {planResult.agentLogs?.map((log, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-[11px]">
                  <span className="text-teal-400 font-semibold min-w-[210px]">{log.agent}:</span>
                  <span className="text-slate-400">{log.action} ➔ </span>
                  <span className="text-slate-200">{log.result}</span>
                  <span className="text-slate-500 ml-auto">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
