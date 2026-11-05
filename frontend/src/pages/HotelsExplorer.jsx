import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Building2, 
  MapPin, 
  Star, 
  DollarSign, 
  Check, 
  Sparkles, 
  Filter, 
  Wifi, 
  Coffee, 
  CheckCircle2, 
  ArrowRight, 
  Search, 
  RotateCw,
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';
import { normalizeDestinationName } from '../utils/destinationData';

export default function HotelsExplorer({ 
  activeDestination = '', 
  tripDuration = 5, 
  totalBudget = 40000, 
  onSelectHotel,
  onDestinationChange
}) {
  const [destination, setDestination] = useState(activeDestination || '');
  const [searchInput, setSearchInput] = useState(activeDestination || '');
  const [hotels, setHotels] = useState([]);
  const [availableAreas, setAvailableAreas] = useState(['All']);
  const [selectedArea, setSelectedArea] = useState('All');
  const [selectedTier, setSelectedTier] = useState('All');
  const [maxBudget, setMaxBudget] = useState(
    Math.max(800, Math.round((totalBudget * 0.4) / Math.max(tripDuration - 1, 1)))
  );
  const [loading, setLoading] = useState(false);
  const [selectedHotelId, setSelectedHotelId] = useState(null);
  const [hasCuratedHotels, setHasCuratedHotels] = useState(true);
  const [hotelSearchError, setHotelSearchError] = useState('');

  // Sync if parent prop changes
  useEffect(() => {
    setDestination(activeDestination || '');
    setSearchInput(activeDestination || '');
    setSelectedArea('All');
    setSelectedTier('All');
  }, [activeDestination]);

  useEffect(() => {
    setMaxBudget(Math.max(800, Math.round((totalBudget * 0.4) / Math.max(tripDuration - 1, 1))));
  }, [totalBudget, tripDuration]);

  // Recommended accommodation budget (40% of overall trip budget)
  const accommodationBudget = Math.round(totalBudget * 0.4);

  useEffect(() => {
    const controller = new AbortController();
    if (!destination.trim()) {
      setHotels([]);
      setAvailableAreas(['All']);
      setLoading(false);
      setHotelSearchError('');
      return () => controller.abort();
    }

    setLoading(true);
    setHotels([]);
    setAvailableAreas(['All']);
    setHotelSearchError('');

    try {
      axios.get('/api/v1/hotels', {
        params: {
          destination,
          maxBudget,
          tier: selectedTier,
          area: selectedArea !== 'All' ? selectedArea : undefined
        },
        signal: controller.signal
      }).then((res) => {
        if (controller.signal.aborted) return;
        if (!res.data?.success || !Array.isArray(res.data.hotels)) {
          throw new Error(res.data?.message || 'The hotel search returned an invalid response.');
        }
        setHasCuratedHotels(res.data.curated !== false);
        setHotels(res.data.hotels);
        setAvailableAreas(res.data.areas?.length ? res.data.areas : ['All']);
      }).catch((err) => {
        if (controller.signal.aborted || axios.isCancel(err)) return;
        setHotels([]);
        setAvailableAreas(['All']);
        setHotelSearchError(err.response?.data?.message || err.message || 'Could not load hotel recommendations. Check your connection and try again.');
      }).finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    } catch (err) {
      if (!controller.signal.aborted) {
        setHotels([]);
        setAvailableAreas(['All']);
        setHotelSearchError(err.message || 'Could not load hotel recommendations.');
        setLoading(false);
      }
    }

    return () => controller.abort();
  }, [destination, selectedArea, selectedTier, maxBudget]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) {
      setHotelSearchError('Enter a destination to find hotel recommendations.');
      return;
    }
    const normalizedDestination = normalizeDestinationName(searchInput);
    setDestination(normalizedDestination);
    setSearchInput(normalizedDestination);
    setSelectedArea('All');
    setSelectedTier('All');
    setMaxBudget(Math.max(800, Math.round(accommodationBudget / Math.max(tripDuration - 1, 1))));
    onDestinationChange?.(normalizedDestination);
  };

  const handleQuickDest = (city) => {
    setSearchInput(city);
    setDestination(city);
    setSelectedArea('All');
    setSelectedTier('All');
    setMaxBudget(Math.max(800, Math.round(accommodationBudget / Math.max(tripDuration - 1, 1))));
    onDestinationChange?.(city);
  };

  const handleTierSelect = (tier) => {
    setSelectedTier(tier);
    setSelectedArea('All');
    if (tier !== 'All') {
      const tierPriceCaps = { Budget: 5000, Moderate: 20000, Luxury: 100000 };
      setMaxBudget(tierPriceCaps[tier]);
    }
  };

  const bookingSearchUrl = `https://www.google.com/travel/search?q=${encodeURIComponent(
    `${selectedTier === 'All' ? '' : `${selectedTier.toLowerCase()} `}hotels in ${destination} under ₹${maxBudget} per night`
  )}`;
  const mapSearchLocation = selectedArea === 'All'
    ? destination
    : `${selectedArea}, ${destination}`;
  const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `hotels near ${mapSearchLocation}`
  )}`;

  const handleSelect = (hotel) => {
    setSelectedHotelId(hotel.id);
    const totalStayCost = hotel.pricePerNight * (tripDuration - 1);
    toast.success(`"${hotel.name}" selected. Check availability with the booking provider.`);
    if (onSelectHotel) {
      onSelectHotel(hotel, totalStayCost);
    }
  };

  const popularCities = ['Goa', 'Manali', 'Paris', 'Tokyo', 'Jaipur', 'Kerala'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
              Suggested Destination Stays
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14213D]">
            {destination ? <>Hotels in <span className="text-[#16A6A1]">{destination}</span> & Surrounding Areas</> : 'Find hotels at your destination'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {destination
              ? <>Suggested stays around {destination}, filtered for your budget of <strong>₹{accommodationBudget.toLocaleString()}</strong> ({tripDuration - 1} Nights). Prices and availability can change; confirm them with the booking provider.</>
              : 'Enter a destination to see nearby stays matched to your trip.'}
          </p>
        </div>

        {/* Live Destination Search Box */}
        <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64">
            <MapPin className="w-4 h-4 text-teal-600 absolute left-3 top-3" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter your destination..."
              className="w-full pl-9 pr-3 py-2.5 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A6A1] text-slate-800"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-[#14213D] text-white font-bold text-xs hover:bg-slate-800 transition flex items-center space-x-1"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
        </form>
      </div>

      {/* Quick Destination Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        <span className="font-bold text-slate-500 whitespace-nowrap">Popular Destinations:</span>
        {popularCities.map((city) => (
          <button
            key={city}
            onClick={() => handleQuickDest(city)}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-bold transition ${
              destination.toLowerCase() === city.toLowerCase()
                ? 'bg-[#16A6A1] text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {city === 'Goa' && '🌴 '}
            {city === 'Manali' && '🏔️ '}
            {city === 'Paris' && '🗼 '}
            {city === 'Tokyo' && '🌸 '}
            {city === 'Jaipur' && '🏰 '}
            {city === 'Kerala' && '🥥 '}
            {city}
          </button>
        ))}
      </div>

      {/* Filters Bar: Budget Slider & Surrounding Neighborhoods */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          {/* Budget Filter */}
          <div className="w-full md:w-80 space-y-1.5">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700">
              <span>Max Budget Per Night</span>
              <span className="text-[#16A6A1] font-extrabold">Up to ₹{maxBudget.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="800"
              max="100000"
              step="500"
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="w-full accent-[#16A6A1] cursor-pointer"
            />
          </div>

          {/* Tier Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {['All', 'Budget', 'Moderate', 'Luxury'].map((tier) => (
              <button
                key={tier}
                onClick={() => handleTierSelect(tier)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  selectedTier === tier
                    ? 'bg-[#14213D] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tier === 'All' ? 'All Tiers' : tier}
              </button>
            ))}
          </div>
        </div>

        {/* Surrounding Areas Chips for THIS specific destination */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          <span className="font-bold text-slate-500 whitespace-nowrap">
            {destination ? `${destination} Surrounding Neighborhoods:` : 'Surrounding Neighborhoods:'}
          </span>
          {availableAreas.map((area) => (
            <button
              key={area}
              onClick={() => setSelectedArea(area)}
              className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition ${
                selectedArea === area
                  ? 'bg-teal-500 text-white shadow-sm font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      <section className="flex flex-col gap-4 rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-50 to-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-extrabold text-[#14213D]">
            {destination ? `Explore hotels near ${selectedArea === 'All' ? destination : `${selectedArea}, ${destination}`}` : 'Enter a destination to explore nearby hotels'}
          </h2>
          <p className="mt-1 text-xs text-slate-600">
            Open Google Maps for current nearby hotel listings and locations. Prices and availability are set by the providers.
          </p>
        </div>
        <a
          href={mapsSearchUrl}
          target="_blank"
          rel="noreferrer"
          aria-disabled={!destination}
          onClick={(event) => {
            if (!destination) {
              event.preventDefault();
              toast.error('Enter a destination before searching Google Maps.');
            }
          }}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#16A6A1] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-teal-700"
        >
          <MapPin className="h-4 w-4" />
          <span>View nearby hotels on Google Maps</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </section>

      {/* Available Hotels Grid */}
      {!destination ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
          <Building2 className="mx-auto h-10 w-10 text-teal-600" />
          <h3 className="mt-3 font-bold text-slate-800">Enter a destination to get started</h3>
          <p className="mt-1 text-xs text-slate-500">Search above or create a plan with your destination to see local hotel options.</p>
        </div>
      ) : loading ? (
        <div className="py-16 text-center space-y-3">
          <RotateCw className="w-8 h-8 text-teal-600 animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-500">Searching suggested stays in {destination}...</p>
        </div>
      ) : hotels.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center space-y-3 border border-slate-200 shadow-sm">
          <Building2 className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-base text-slate-800">
            {hotelSearchError
              ? 'Hotel recommendations are unavailable'
              : hasCuratedHotels
                ? `No ${selectedTier === 'All' ? '' : `${selectedTier} `}stays in ${destination} under ₹${maxBudget.toLocaleString()} per night`
                : `No curated hotel listings are available for ${destination} yet`}
          </h3>
          <p className="text-xs text-slate-500">
            {hotelSearchError || (hasCuratedHotels
              ? 'Try increasing your nightly budget, choosing another tier, or searching current listings.'
              : 'Search current hotel listings for this destination and selected tier.')}
          </p>
          {!hotelSearchError && (
            <a
              href={bookingSearchUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#14213D] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
            >
              <Search className="h-4 w-4" /> Search {selectedTier === 'All' ? '' : `${selectedTier} `}stays in {destination}
            </a>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => {
            const totalStayCost = hotel.pricePerNight * (tripDuration - 1);
            const fitsBudget = totalStayCost <= accommodationBudget;
            const isSelected = selectedHotelId === hotel.id;

            return (
              <div 
                key={hotel.id}
                className={`bg-white rounded-3xl border shadow-sm overflow-hidden flex flex-col justify-between transition hover:shadow-md ${
                  isSelected ? 'border-teal-500 ring-2 ring-teal-500/30' : 'border-slate-200/90'
                }`}
              >
                <div>
                  {/* Photo & Badges */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <img 
                      src={hotel.image} 
                      alt={hotel.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                        {hotel.area}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 flex items-center space-x-1 px-2.5 py-1 rounded-full bg-white/95 text-slate-900 text-xs font-extrabold shadow">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                      <span>{hotel.rating}</span>
                      <span className="text-[10px] font-normal text-slate-500">({hotel.reviewsCount})</span>
                    </div>

                    <div className="absolute bottom-3 left-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow ${
                        fitsBudget ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                      }`}>
                        {fitsBudget ? '✓ Fits Group Target Budget' : 'Splurge / Luxury Tier'}
                      </span>
                    </div>
                  </div>

                  {/* Details Body */}
                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="font-extrabold text-base text-[#14213D] line-clamp-1">{hotel.name}</h3>
                      <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        hotel.tier === 'Luxury'
                          ? 'bg-amber-100 text-amber-800'
                          : hotel.tier === 'Moderate'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {hotel.tier} stay
                      </span>
                      <p className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{hotel.distance}</span>
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {hotel.description}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Indicative listing and nightly price. Verify current availability and final price before booking.
                    </p>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {hotel.amenities?.slice(0, 3).map((amenity, idx) => (
                        <span 
                          key={idx} 
                          className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>

                    {/* Price Breakdown */}
                    <div className="pt-3 border-t border-slate-100 flex items-end justify-between">
                      <div>
                        <span className="text-[11px] text-slate-400 block">Nightly Rate</span>
                        <div className="flex items-baseline space-x-1">
                          <span className="text-lg font-extrabold text-[#16A6A1]">₹{hotel.pricePerNight.toLocaleString()}</span>
                          <span className="text-[10px] text-slate-500">/ night</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] text-slate-400 block">{tripDuration - 1} Nights Total</span>
                        <span className="text-sm font-bold text-slate-800">
                          ₹{totalStayCost.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="grid gap-2 p-5 pt-0">
                  <a
                    href={`https://www.google.com/travel/search?q=${encodeURIComponent(`${hotel.name}, ${hotel.area}, ${destination}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center space-x-1.5 rounded-xl border border-teal-600 bg-teal-50 py-2.5 text-xs font-bold text-teal-800 transition hover:bg-teal-100"
                  >
                    <Search className="h-4 w-4" />
                    <span>Check availability & book</span>
                  </a>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`hotels near ${hotel.area}, ${destination}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    <MapPin className="h-4 w-4" />
                    <span>Find nearby hotels on Google Maps</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <button
                    onClick={() => handleSelect(hotel)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center space-x-1.5 ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow'
                        : 'bg-[#14213D] hover:bg-slate-800 text-white'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Selected for {destination} Trip</span>
                      </>
                    ) : (
                      <>
                        <Building2 className="w-4 h-4" />
                        <span>Select Stay</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
