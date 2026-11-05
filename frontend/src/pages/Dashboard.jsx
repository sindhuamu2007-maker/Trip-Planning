import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Sparkles, 
  Plus, 
  Trash2,
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Compass, 
  ArrowRight, 
  Building2, 
  CheckCircle2, 
  Plane,
  Copy,
  UserPlus,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Dashboard({ setActiveTab, onSelectTrip }) {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showJoinModal, setShowJoinModal] = useState(() => new URLSearchParams(window.location.search).has('join'));
  const [tripCode, setTripCode] = useState(() => new URLSearchParams(window.location.search).get('join') || '');
  const [isJoining, setIsJoining] = useState(false);
  const [tripToShare, setTripToShare] = useState(null);
  const [showCreateTripModal, setShowCreateTripModal] = useState(false);
  const [newTripTitle, setNewTripTitle] = useState('');
  const [newTripDestination, setNewTripDestination] = useState('');
  const [isCreatingTrip, setIsCreatingTrip] = useState(false);

  const fetchTrips = async () => {
    try {
      const res = await axios.get('/api/v1/trips');
      if (res.data && res.data.trips) {
        setTrips(res.data.trips);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not load your group trips. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleJoinTrip = async (e) => {
    e.preventDefault();
    const enteredValue = tripCode.trim();
    const inviteQuery = enteredValue.includes('?')
      ? enteredValue.slice(enteredValue.indexOf('?') + 1)
      : enteredValue.startsWith('join=')
        ? enteredValue
        : '';
    const code = (new URLSearchParams(inviteQuery).get('join') || enteredValue).trim();
    if (!code) {
      toast.error('Enter a trip ID or paste a valid invite link.');
      return;
    }

    setIsJoining(true);
    try {
      const res = await axios.post(`/api/v1/trips/join/${encodeURIComponent(code)}`);
      if (!res.data?.success || !res.data.trip) {
        throw new Error(res.data?.message || 'Unable to join this trip.');
      }

      const joinedTrip = res.data.trip;
      setTrips((currentTrips) => [
        joinedTrip,
        ...currentTrips.filter((trip) => trip._id !== joinedTrip._id)
      ]);
      if (onSelectTrip) onSelectTrip(joinedTrip);
      setShowJoinModal(false);
      setTripCode('');
      window.history.replaceState({}, '', window.location.pathname);
      setActiveTab('itinerary');
      toast.success(`You're in! ${joinedTrip.title} is ready to plan together.`);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Could not join this trip. Check the ID and try again.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleCreateGroupTrip = async (e) => {
    e.preventDefault();
    const destination = newTripDestination.trim();
    if (!destination) {
      toast.error('Enter a destination to create your group trip.');
      return;
    }

    setIsCreatingTrip(true);
    try {
      const res = await axios.post('/api/v1/trips', {
        title: newTripTitle.trim() || `Trip to ${destination}`,
        destination,
        durationDays: 5,
        budget: 40000,
        travelersCount: 4
      });
      if (!res.data?.success || !res.data.trip?._id) {
        throw new Error(res.data?.message || 'The trip could not be created.');
      }

      const createdTrip = res.data.trip;
      setTrips((currentTrips) => [createdTrip, ...currentTrips]);
      if (onSelectTrip) onSelectTrip(createdTrip);
      setShowCreateTripModal(false);
      setNewTripTitle('');
      setNewTripDestination('');
      setTripToShare(createdTrip);
      toast.success('Group trip created. Share its planning code with your travelers.');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Could not create the group trip. Please try again.');
    } finally {
      setIsCreatingTrip(false);
    }
  };

  const handleRemoveTrip = async (trip) => {
    const isOwner = trip.owner?._id === user?.id || trip.owner === user?.id;
    const prompt = isOwner
      ? `Permanently delete "${trip.title}" and its itinerary for everyone? This cannot be undone.`
      : `Remove "${trip.title}" from your trip history and leave the group?`;
    if (!window.confirm(prompt)) return;

    try {
      const res = await axios.delete(`/api/v1/trips/${encodeURIComponent(trip._id)}`);
      if (!res.data?.success) {
        throw new Error(res.data?.message || 'The trip could not be removed.');
      }
      setTrips((currentTrips) => currentTrips.filter((currentTrip) => currentTrip._id !== trip._id));
      toast.success(isOwner ? 'Trip deleted.' : 'Trip removed from your history.');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Could not remove the trip. Please try again.');
    }
  };

  const copyToClipboard = async (text, successMessage) => {
    try {
      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(text);
          toast.success(successMessage);
          return;
        } catch (err) {
          // Fall back for browsers that expose the API but deny clipboard permission.
        }
      }

      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.setAttribute('readonly', '');
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      const copied = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (!copied) throw new Error('Clipboard copy was rejected.');
      toast.success(successMessage);
    } catch (err) {
      toast.error('Could not copy automatically. Select the code or link and copy it manually.');
    }
  };

  const getTripInviteLink = (trip) => (
    `${window.location.origin}${window.location.pathname}?join=${encodeURIComponent(trip._id)}`
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Welcome & Fresh Start Control Banner */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#14213D] rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-lg">
        <img
          src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=85"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#14213D] via-[#14213D]/90 to-[#14213D]/30" />
        <div className="relative space-y-1">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300">Your next great story starts here</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Where to next, {user?.name || 'Explorer'}?
          </h1>
          <p className="max-w-xl text-sm text-white/75">
            Dream up a destination, invite your favorite people, and turn the journey into a shared adventure.
          </p>
        </div>

        <div className="relative flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setShowJoinModal(true)}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border border-white/40 bg-white/10 text-white font-bold text-sm hover:bg-white/20 transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>Join a trip</span>
          </button>
          <button
            onClick={() => setShowCreateTripModal(true)}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border border-white/40 bg-white/10 text-white font-bold text-sm hover:bg-white/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create planning code</span>
          </button>
          <button
            onClick={() => setActiveTab('ai-planner')}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#16A6A1] to-[#FF8066] text-white font-bold text-sm shadow-md hover:opacity-95 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>Create Group Trip with AI</span>
          </button>
        </div>
      </div>

      {/* Fresh Start Empty State (when user has 0 trips yet) */}
      {trips.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center space-y-6 shadow-sm">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-teal-50 flex items-center justify-center text-[#16A6A1] shadow-inner">
            <Plane className="w-10 h-10 animate-pulse" />
          </div>

          <div className="max-w-lg mx-auto space-y-2">
            <h2 className="text-2xl font-extrabold text-[#14213D]">
              Ready to Start Your First Journey?
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              You haven't created any trips yet. Enter your dream destination, budget, and group preferences — our autonomous multi-agent AI will craft your complete itinerary in seconds!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setShowCreateTripModal(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#14213D] text-white font-bold text-sm shadow-lg hover:bg-slate-800 transition flex items-center justify-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Group Planning Code</span>
            </button>
            <button
              onClick={() => setActiveTab('ai-planner')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#16A6A1] to-[#FF8066] text-white font-bold text-sm shadow-lg hover:scale-105 transition-transform flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create Your First Group Trip with AI</span>
            </button>

            <button
              onClick={() => setActiveTab('hotels')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-sm transition flex items-center justify-center space-x-2"
            >
              <Building2 className="w-4 h-4 text-teal-600" />
              <span>Explore Surrounding Hotels with Budget</span>
            </button>
          </div>

          {/* Quick inspiration chips */}
          <div className="pt-6 border-t border-slate-100 max-w-xl mx-auto">
            <p className="text-xs text-slate-400 font-medium mb-3">Popular Starting Destinations:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['🌴 Goa Beaches & Forts (₹40,000)', '🏔️ Manali Adventure Trek (₹65,000)', '🗼 Paris Cultural Odyssey', '🌸 Tokyo Tech & Sights'].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTab('ai-planner')}
                  className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-200 transition"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Trips Gallery (when trips exist) */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#14213D]">Your Trip History ({trips.length})</h2>
              <p className="mt-1 text-xs text-slate-500">Saved trips stay here until you manually remove them.</p>
            </div>
            <button
              onClick={() => setActiveTab('ai-planner')}
              className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center space-x-1"
            >
              <span>+ Create Another Group Trip</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trips.map((trip) => (
              <div 
                key={trip._id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Trip Image & Badges */}
                  <div className="relative h-44 w-full overflow-hidden">
                    <img 
                      src={trip.coverImage || "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80"} 
                      alt={trip.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[11px] font-bold border border-white/20">
                        {trip.durationDays} Days
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-full bg-teal-500 text-white text-[11px] font-bold shadow-md">
                        {trip.status}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="flex items-center space-x-1.5 text-xs text-teal-300 font-medium mb-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{trip.destination}</span>
                      </div>
                      <h3 className="text-lg font-extrabold truncate">{trip.title}</h3>
                    </div>
                  </div>

                  {/* Details Body */}
                  <div className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center space-x-2 text-slate-600">
                        <Calendar className="w-4 h-4 text-teal-600" />
                        <span>{trip.durationDays} Days Duration</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-600">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span>{trip.travelersCount || 4} Travelers</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-600">
                        <DollarSign className="w-4 h-4 text-amber-600" />
                        <span>₹{(trip.budget?.total || 40000).toLocaleString()} Total</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-600">
                        <Sparkles className="w-4 h-4 text-coral-500" />
                        <span className="truncate">{trip.travelStyle || 'Balanced Explorer'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-5 pt-0 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  <button
                    onClick={() => {
                      if (onSelectTrip) onSelectTrip(trip);
                      setActiveTab('itinerary');
                    }}
                    className="w-full flex items-center justify-center space-x-1.5 py-2.5 rounded-xl bg-[#14213D] text-white text-xs font-bold hover:bg-slate-800 transition"
                  >
                    <span>Open Itinerary</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (onSelectTrip) onSelectTrip(trip);
                      setActiveTab('hotels');
                    }}
                    className="w-full flex items-center justify-center space-x-1.5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
                  >
                    <Building2 className="w-3.5 h-3.5 text-teal-600" />
                    <span>View Hotels</span>
                  </button>
                  <button
                    onClick={() => setTripToShare(trip)}
                    className="w-full flex items-center justify-center space-x-1.5 py-2.5 rounded-xl border border-teal-200 text-teal-700 text-xs font-bold hover:bg-teal-50 transition"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Invite group</span>
                  </button>
                  <button
                    onClick={() => handleRemoveTrip(trip)}
                    aria-label={`Remove ${trip.title} from trip history`}
                    title="Manually remove this trip from history"
                    className="w-full flex items-center justify-center space-x-1.5 py-2.5 rounded-xl border border-rose-200 text-rose-700 text-xs font-bold hover:bg-rose-50 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#14213D]/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md space-y-5 rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Travel is better together</span>
                <h2 className="mt-1 text-xl font-extrabold text-[#14213D]">Join your crew</h2>
                <p className="mt-1 text-sm text-slate-500">Enter the trip ID or paste the invite link shared by any trip member.</p>
              </div>
              <button onClick={() => setShowJoinModal(false)} aria-label="Close" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleJoinTrip} className="space-y-3">
              <label htmlFor="trip-code" className="block text-xs font-bold text-slate-700">Trip ID</label>
              <div className="flex gap-2">
                <input
                  id="trip-code"
                  value={tripCode}
                  onChange={(e) => setTripCode(e.target.value)}
                  placeholder="Trip ID or invite link"
                  autoComplete="off"
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
                <button
                  type="submit"
                  disabled={isJoining}
                  className="flex items-center gap-2 rounded-xl bg-[#16A6A1] px-4 py-3 text-sm font-bold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isJoining ? 'Joining…' : 'Join'}
                  {!isJoining && <ArrowRight className="h-4 w-4" />}
                </button>
              </div>
            </form>
            <div className="flex items-center gap-2 rounded-xl bg-teal-50 p-3 text-xs text-teal-800">
              <Copy className="h-4 w-4 shrink-0" />
              <span>Ask any trip member to share the Trip ID or invite link from the itinerary.</span>
            </div>
          </div>
        </div>
      )}
      {showCreateTripModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#14213D]/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md space-y-5 rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Start planning together</span>
                <h2 className="mt-1 text-xl font-extrabold text-[#14213D]">Create a group planning code</h2>
                <p className="mt-1 text-sm text-slate-500">Create a trip first, then share its code so others can join your group.</p>
              </div>
              <button onClick={() => setShowCreateTripModal(false)} aria-label="Close" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateGroupTrip} className="space-y-4">
              <label htmlFor="new-trip-title" className="block space-y-1.5 text-xs font-bold text-slate-700">
                Trip name <span className="font-normal text-slate-500">(optional)</span>
                <input
                  id="new-trip-title"
                  value={newTripTitle}
                  onChange={(e) => setNewTripTitle(e.target.value)}
                  placeholder="Summer trip with friends"
                  maxLength={100}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-normal text-slate-800 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </label>
              <label htmlFor="new-trip-destination" className="block space-y-1.5 text-xs font-bold text-slate-700">
                Destination
                <input
                  id="new-trip-destination"
                  value={newTripDestination}
                  onChange={(e) => setNewTripDestination(e.target.value)}
                  placeholder="e.g. Goa"
                  maxLength={100}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-normal text-slate-800 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </label>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowCreateTripModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingTrip}
                  className="flex items-center gap-2 rounded-xl bg-[#16A6A1] px-4 py-3 text-sm font-bold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCreatingTrip ? 'Creating…' : 'Create trip & code'}
                  {!isCreatingTrip && <ArrowRight className="h-4 w-4" />}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {tripToShare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#14213D]/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md space-y-5 rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Invite your crew</span>
                <h2 className="mt-1 text-xl font-extrabold text-[#14213D]">Share group planning code</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Share this code or link. Your friends can join from the dashboard and plan this trip with you.
                </p>
              </div>
              <button onClick={() => setTripToShare(null)} aria-label="Close" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label htmlFor="group-planning-code" className="mb-1.5 block text-xs font-bold text-slate-700">Group planning code</label>
                <div className="flex gap-2">
                  <input
                    id="group-planning-code"
                    readOnly
                    value={tripToShare._id}
                    className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm text-slate-800"
                  />
                  <button
                    onClick={() => copyToClipboard(tripToShare._id, 'Group planning code copied.')}
                    className="flex items-center gap-2 rounded-xl bg-[#14213D] px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                  >
                    <Copy className="h-4 w-4" />
                    <span>Copy code</span>
                  </button>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(getTripInviteLink(tripToShare), 'Group invite link copied.')}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#16A6A1] px-4 py-3 text-sm font-bold text-white transition hover:bg-teal-700"
              >
                <Copy className="h-4 w-4" />
                <span>Copy invite link</span>
              </button>
              <p className="rounded-xl bg-teal-50 p-3 text-xs leading-relaxed text-teal-800">
                Anyone with this code or link can join the trip. Ask them to sign in to TripSync first.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
