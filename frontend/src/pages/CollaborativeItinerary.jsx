import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Plus, 
  Sparkles, 
  Users, 
  AlertTriangle, 
  Check, 
  X, 
  Trash2, 
  Radio, 
  MessageSquare, 
  Send, 
  RotateCw,
  Copy,
  Share2,
  Route
} from 'lucide-react';
import { getDestinationData } from '../utils/destinationData';
import toast from 'react-hot-toast';

export default function CollaborativeItinerary({ activeTrip, destination = '', onDestinationChange }) {
  const currentDest = destination || activeTrip?.destination || '';
  const [selectedDest, setSelectedDest] = useState(currentDest);
  const [activeDay, setActiveDay] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showConflictAlert, setShowConflictAlert] = useState(true);

  // Dynamic destination data
  const destData = getDestinationData(selectedDest);

  // Initialize days from active trip if provided, or from destination data
  const [days, setDays] = useState(activeTrip?.days || destData.itineraryDays);

  useEffect(() => {
    const nextDestination = destination || activeTrip?.destination || '';
    if (nextDestination !== selectedDest) {
      setSelectedDest(nextDestination);
    }
  }, [activeTrip, destination]);

  useEffect(() => {
    const data = getDestinationData(selectedDest);
    setDays(activeTrip?.destination?.toLowerCase().includes(selectedDest.toLowerCase()) && activeTrip?.days?.length > 0
      ? activeTrip.days 
      : data.itineraryDays);
    setActiveDay(1);
  }, [selectedDest]);

  // Real-time collaborative chat state
  const [chatMessages, setChatMessages] = useState([
    { sender: 'Alex Johnson', text: `Hey team, super excited for our ${selectedDest} trip!`, time: '10:14 AM' },
    { sender: 'Priya Sharma', text: `The weather in ${selectedDest} looks ideal for our outdoor plans!`, time: '10:16 AM' },
    { sender: 'TripSync AI Agent', text: `⚡ Schedule tip: Route optimizer pre-sequenced Day 2 stops to avoid peak travel hours in ${selectedDest}.`, time: '10:17 AM', isAi: true }
  ]);
  const [newMessage, setNewMessage] = useState('');

  // Form state for adding an activity
  const [newTitle, setNewTitle] = useState('');
  const [newTimeSlot, setNewTimeSlot] = useState('Morning');
  const [newCategory, setNewCategory] = useState('Sightseeing');
  const [newCost, setNewCost] = useState('');
  const [newLocation, setNewLocation] = useState('');

  const currentDayData = days.find(d => d.dayNumber === activeDay) || days[0];
  const tripCode = activeTrip?._id;
  const inviteLink = tripCode
    ? `${window.location.origin}/?join=${encodeURIComponent(tripCode)}`
    : '';

  const handleSwitchDest = (dest) => {
    setSelectedDest(dest);
    if (onDestinationChange) onDestinationChange(dest);
    toast.success(`Switched itinerary destination to ${dest}!`);
  };

  const handleCopyInvite = async (value, successMessage) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(successMessage);
    } catch {
      toast.error('Could not copy the invite. Please copy it manually.');
    }
  };

  const handleShareInvite = async () => {
    const shareData = {
      title: `Join my ${selectedDest} trip`,
      text: `Let's plan our ${selectedDest} trip together on TripSync AI. Use this trip ID to join: ${tripCode}`,
      url: inviteLink
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          toast.error('Could not open the share menu. Copy the trip link instead.');
        }
      }
      return;
    }

    await handleCopyInvite(inviteLink, 'Invite link copied. Send it to your travel crew!');
  };

  const handleAddRecommendedStop = (waypoint) => {
    const alreadyAdded = currentDayData?.activities?.some((activity) =>
      activity.location?.toLowerCase() === waypoint.name.toLowerCase()
      || activity.title?.toLowerCase() === waypoint.name.toLowerCase()
    );
    if (alreadyAdded) {
      toast.error('This place is already on the selected day.');
      return;
    }

    const activity = {
      id: `route-stop-${Date.now()}`,
      title: waypoint.name,
      timeSlot: 'Afternoon',
      startTime: '14:00',
      endTime: '16:00',
      category: waypoint.type || 'Sightseeing',
      location: waypoint.name,
      cost: 0,
      costEstimateKnown: false,
      votes: 1
    };

    setDays((prevDays) => prevDays.map((day) => (
      day.dayNumber === activeDay
        ? { ...day, activities: [...day.activities, activity] }
        : day
    )));
    toast.success(`${waypoint.name} added to Day ${activeDay}. Check local admission details before you go.`);
  };

  const handleAddActivity = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newAct = {
      id: 'act-' + Date.now(),
      title: newTitle,
      timeSlot: newTimeSlot,
      startTime: newTimeSlot === 'Morning' ? '10:00' : newTimeSlot === 'Afternoon' ? '14:00' : '18:30',
      endTime: newTimeSlot === 'Morning' ? '12:00' : newTimeSlot === 'Afternoon' ? '16:00' : '20:30',
      category: newCategory,
      location: newLocation || `${selectedDest} Local Point`,
      cost: Number(newCost) || 0,
      votes: 1
    };

    setDays(prevDays => prevDays.map(d => {
      if (d.dayNumber === activeDay) {
        return { ...d, activities: [...d.activities, newAct] };
      }
      return d;
    }));

    toast.success(`Activity added & broadcast to all room members!`);
    setShowAddModal(false);
    setNewTitle('');
    setNewCost('');
    setNewLocation('');
  };

  const handleDeleteActivity = (actId) => {
    setDays(prevDays => prevDays.map(d => {
      if (d.dayNumber === activeDay) {
        return { ...d, activities: d.activities.filter(a => a.id !== actId) };
      }
      return d;
    }));
    toast.success('Activity removed');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setChatMessages([...chatMessages, {
      sender: 'You',
      text: newMessage,
      time: 'Just now'
    }]);
    setNewMessage('');
  };

  const popularDestinations = ['Goa', 'Manali', 'Paris', 'Tokyo', 'Jaipur'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      {/* Header & Live Room Presence */}
      <div className="bg-gradient-to-br from-white via-white to-teal-50 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-[#16A6A1] text-xs font-bold border border-teal-500/30 flex items-center space-x-1.5">
              <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
              <span>Real-Time Socket Room: trip-{selectedDest.toLowerCase()}-2026</span>
            </span>
            <span className="text-xs text-slate-400">Sync Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14213D] mt-1">
            {selectedDest} Collaborative Itinerary Workspace
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time multi-user shared schedule for <strong className="text-slate-900">{selectedDest}</strong> with instant conflict detection.
          </p>
        </div>

        {/* Live Collaborator Presence Indicators */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-3 bg-white/80 px-4 py-2.5 rounded-2xl border border-slate-200">
          <span className="text-xs font-bold text-slate-700">Online Now:</span>
          <div className="flex items-center -space-x-2">
            <div className="relative group cursor-pointer" title="You (Organizer)">
              <img className="w-8 h-8 rounded-full border-2 border-emerald-500 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="You" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white"></span>
            </div>
            <div className="relative group cursor-pointer" title="Alex Johnson">
              <img className="w-8 h-8 rounded-full border-2 border-emerald-500 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Alex" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white"></span>
            </div>
            <div className="relative group cursor-pointer" title="Priya Sharma">
              <img className="w-8 h-8 rounded-full border-2 border-emerald-500 object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="Priya" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white"></span>
            </div>
          </div>
          </div>
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 rounded-xl bg-[#14213D] px-4 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-slate-800"
          >
            <Users className="h-4 w-4" />
            Invite your crew
          </button>
        </div>
      </div>

      {/* Destination Quick Selector */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        <span className="font-bold text-slate-500 whitespace-nowrap">Switch Destination Schedule:</span>
        {popularDestinations.map((dest) => (
          <button
            key={dest}
            onClick={() => handleSwitchDest(dest)}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-bold transition ${
              selectedDest.toLowerCase() === dest.toLowerCase()
                ? 'bg-[#16A6A1] text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {dest === 'Goa' && '🌴 '}
            {dest === 'Manali' && '🏔️ '}
            {dest === 'Paris' && '🗼 '}
            {dest === 'Tokyo' && '🌸 '}
            {dest === 'Jaipur' && '🏰 '}
            {dest}
          </button>
        ))}
      </div>

      {/* AI Schedule Conflict Alert Banner (Destination Aware) */}
      {showConflictAlert && (
        <div className="bg-amber-500/10 border border-amber-500/40 rounded-2xl p-4 text-amber-900 flex items-start justify-between gap-3 shadow-sm animate-fadeIn">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                  AI Conflict Engine ({selectedDest})
                </span>
                <span className="text-xs font-semibold text-slate-700">Schedule Optimization Detected</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Activities on Day 2 in <strong>{selectedDest}</strong> have a transit window of ~45 mins.
                <br />
                <em>AI Solution: Morning activity sequence automatically smoothed to avoid peak transit congestion.</em>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={() => {
                setShowConflictAlert(false);
                toast.success('AI schedule optimization applied!');
              }}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Accept AI Fix</span>
            </button>
            <button
              onClick={() => setShowConflictAlert(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Workspace Main Area: Day Tabs + Timeline + Live Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Schedule Timeline */}
        <div className="lg:col-span-2 space-y-4">
          {/* Day Navigation Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1">
            {days.map((day) => (
              <button
                key={day.dayNumber}
                onClick={() => setActiveDay(day.dayNumber)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition whitespace-nowrap ${
                  activeDay === day.dayNumber
                    ? 'bg-[#14213D] text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>Day {day.dayNumber}</span>
                <span className="text-[10px] opacity-75 font-normal">({day.activities?.length || 0} stops)</span>
              </button>
            ))}
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-1 px-3.5 py-2 rounded-xl bg-teal-500/10 text-[#16A6A1] hover:bg-teal-500/20 font-bold text-xs border border-teal-500/30 whitespace-nowrap ml-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Stop in {selectedDest}</span>
            </button>
          </div>

          {/* Current Day Header */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-teal-600 uppercase">
                  {selectedDest} • Day {currentDayData?.dayNumber || 1} Overview
                </span>
                <h3 className="text-lg font-extrabold text-[#14213D]">{currentDayData?.title || 'Daily Schedule'}</h3>
              </div>
              <span className="text-xs font-medium text-slate-500">
                {currentDayData?.activities?.length || 0} Planned Events
              </span>
            </div>

            {/* Activities Timeline */}
            <div className="space-y-3">
              {currentDayData?.activities?.map((act) => (
                <div 
                  key={act.id}
                  className="bg-slate-50 rounded-xl p-4 border border-slate-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-teal-500/50 transition group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                        {act.timeSlot}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{act.startTime} - {act.endTime}</span>
                      </span>
                      <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {act.category}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-teal-700 transition">
                      {act.title}
                    </h4>

                    <div className="flex items-center space-x-3 text-xs text-slate-500">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{act.location}</span>
                      </span>
                      <span>•</span>
                      <span className="font-bold text-slate-800">
                        {act.costEstimateKnown === false || act.cost == null
                          ? 'Check locally'
                          : act.cost
                            ? `₹${act.cost.toLocaleString()}`
                            : 'Free'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-center">
                    <button 
                      onClick={() => handleDeleteActivity(act.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition"
                      title="Remove stop"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Route-aware places to add to the selected day */}
          <section className="overflow-hidden rounded-2xl border border-teal-100 bg-gradient-to-br from-[#eefaf8] via-white to-[#fff6f1] p-5 shadow-sm">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-teal-700">
                  <Route className="h-3.5 w-3.5" />
                  {destData.routeWaypoints?.length ? 'Curated for your route' : 'Find places for your route'}
                </span>
                <h3 className="mt-1 text-lg font-extrabold text-[#14213D]">
                  {destData.routeWaypoints?.length ? `Worth a stop in ${selectedDest}` : `Explore places in ${selectedDest}`}
                </h3>
                <p className="text-xs text-slate-500">
                  {destData.routeWaypoints?.length
                    ? `Add a nearby highlight to Day ${activeDay} of your journey.`
                    : `No curated stops yet. Search for current attractions in ${selectedDest}.`}
                </p>
              </div>
              <button
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedDest)}`, '_blank', 'noopener,noreferrer')}
                className="self-start rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-teal-300 hover:text-teal-700 sm:self-auto"
              >
                Explore on map
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {(destData.routeWaypoints || []).map((place) => (
                <article key={`${selectedDest}-${place.order}`} className="rounded-xl border border-white bg-white/90 p-4 shadow-sm">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-extrabold text-teal-800">
                      {place.order}
                    </span>
                    <span className="rounded-full bg-orange-50 px-2 py-1 text-[10px] font-bold text-orange-700">{place.type}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#14213D]">{place.name}</h4>
                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{place.timeAllocated} visit</span>
                    <span>{place.openHours}</span>
                  </div>
                  <button
                    onClick={() => handleAddRecommendedStop(place)}
                    disabled={!currentDayData}
                    className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 py-2 text-xs font-bold text-teal-800 transition hover:bg-teal-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add to Day {activeDay}
                  </button>
                </article>
              ))}
            </div>
            {destData.routeWaypoints?.length > 0 && (
              <p className="mt-3 text-[10px] text-slate-500">Opening hours and visit times are suggestions; confirm locally before traveling.</p>
            )}
          </section>
        </div>

        {/* Right Col: Real-time Group Chat & AI Companion */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[520px]">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-teal-600" />
              <h3 className="font-bold text-sm text-[#14213D]">{selectedDest} Group Chat</h3>
            </div>
            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Live Socket
            </span>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {chatMessages.map((msg, idx) => (
              <div 
                key={idx}
                className={`flex flex-col space-y-1 ${msg.sender === 'You' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center space-x-1.5 text-[10px] text-slate-400">
                  <span className={`font-bold ${msg.isAi ? 'text-teal-600' : 'text-slate-700'}`}>{msg.sender}</span>
                  <span>•</span>
                  <span>{msg.time}</span>
                </div>
                <div 
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                    msg.isAi
                      ? 'bg-teal-500/10 border border-teal-500/30 text-teal-900'
                      : msg.sender === 'You'
                      ? 'bg-[#14213D] text-white rounded-br-none'
                      : 'bg-slate-100 text-slate-800 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 flex items-center space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Message travel crew in ${selectedDest}...`}
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#16A6A1]"
            />
            <button
              type="submit"
              className="p-2 bg-[#16A6A1] text-white rounded-xl hover:bg-teal-700 transition"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Add Activity Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#14213D]/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md space-y-5 rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Good trips are shared</span>
                <h3 className="mt-1 text-xl font-extrabold text-[#14213D]">Bring your crew along</h3>
                <p className="mt-1 text-sm text-slate-500">Send this trip ID to friends so they can join your itinerary.</p>
              </div>
              <button onClick={() => setShowInviteModal(false)} aria-label="Close invite dialog" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            {tripCode ? (
              <>
                <div className="rounded-2xl border border-dashed border-teal-300 bg-teal-50 p-4">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-teal-800">Trip ID</p>
                  <div className="flex items-center gap-2">
                    <code className="min-w-0 flex-1 break-all font-mono text-sm font-bold text-[#14213D]">{tripCode}</code>
                    <button
                      onClick={() => handleCopyInvite(tripCode, 'Trip ID copied. Send it to your travel crew!')}
                      aria-label="Copy trip ID"
                      className="rounded-lg bg-white p-2.5 text-teal-700 shadow-sm transition hover:bg-teal-100"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleShareInvite}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#16A6A1] to-[#147a77] px-4 py-3 text-sm font-bold text-white shadow-md transition hover:opacity-95"
                >
                  <Share2 className="h-4 w-4" /> Share invite link
                </button>
                <p className="text-center text-[11px] text-slate-500">Your friends can paste the ID using “Join a trip” on their dashboard.</p>
              </>
            ) : (
              <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
                Save a trip first to create its shareable ID. Open a saved trip from your dashboard, then invite your crew here.
              </div>
            )}
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-[#14213D]">Add Stop in {selectedDest} (Day {activeDay})</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddActivity} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Activity Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={`e.g. Landmark tour in ${selectedDest}`}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#16A6A1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time Slot</label>
                  <select
                    value={newTimeSlot}
                    onChange={(e) => setNewTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="Sightseeing">Sightseeing</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Food & Dining">Food & Dining</option>
                    <option value="Culture">Culture</option>
                    <option value="Relaxation">Relaxation</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Est. Cost (₹)</label>
                  <input
                    type="number"
                    value={newCost}
                    onChange={(e) => setNewCost(e.target.value)}
                    placeholder="e.g. 1200"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Location / Landmark</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder={`e.g. ${selectedDest} Landmark`}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#16A6A1] text-white font-bold hover:bg-teal-700 transition"
                >
                  Broadcast & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
