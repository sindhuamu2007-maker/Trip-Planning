const express = require('express');
const router = express.Router();

const DESTINATION_ALIASES = new Map([
  ['goa', 'goa'],
  ['goa india', 'goa'],
  ['north goa', 'goa'],
  ['south goa', 'goa'],
  ['manali', 'manali'],
  ['monali', 'manali'],
  ['manaly', 'manali'],
  ['manali himachal', 'manali'],
  ['manali himachal pradesh', 'manali'],
  ['manali spiti', 'manali'],
  ['manali spiti india', 'manali'],
  ['himachal', 'manali'],
  ['himachal pradesh', 'manali'],
  ['spiti', 'manali'],
  ['paris', 'paris'],
  ['paris france', 'paris'],
  ['france', 'paris'],
  ['tokyo', 'tokyo'],
  ['tokyo japan', 'tokyo'],
  ['japan', 'tokyo'],
  ['jaipur', 'jaipur'],
  ['jaipur india', 'jaipur'],
  ['jaipur rajasthan', 'jaipur'],
  ['rajasthan', 'jaipur'],
  ['kerala', 'kerala'],
  ['kerala india', 'kerala'],
  ['munnar', 'kerala'],
  ['kochi', 'kerala'],
  ['fort kochi', 'kerala'],
  ['alleppey', 'kerala']
]);

const normalizeDestination = (destination) => destination
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim()
  .replace(/\s+/g, ' ');

const HOTELS_DATABASE = {
  goa: [
    {
      id: 'h-goa-1',
      name: 'Sea Breeze Heritage Villa & Pool',
      area: 'Calangute (North Goa)',
      distance: '350m to Calangute Beach',
      pricePerNight: 2800,
      currency: 'INR',
      rating: 4.8,
      reviewsCount: 312,
      tier: 'Moderate',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      amenities: ['Swimming Pool', 'Free Breakfast', 'High-Speed Wi-Fi', 'AC & Balcony', 'Free Parking'],
      description: 'Charming Portuguese heritage villa surrounded by tropical gardens, walking distance from beach shacks and cafes.'
    },
    {
      id: 'h-goa-2',
      name: 'Baga Waters Beachside Hostel & Social Hub',
      area: 'Baga Beach (North Goa)',
      distance: '150m to Baga Strip & Watersports',
      pricePerNight: 950,
      currency: 'INR',
      rating: 4.6,
      reviewsCount: 480,
      tier: 'Budget',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
      amenities: ['Backpacker Lounge', 'Free Wi-Fi', 'Cafe & Bar', 'Air Conditioned', 'Bicycle Rental'],
      description: 'Vibrant, clean backpacker-friendly stay ideal for solo travelers and friend groups looking for social vibes and nightlife.'
    },
    {
      id: 'h-goa-3',
      name: 'Casa Candolim Boutique Beachfront Retreat',
      area: 'Candolim (North Goa)',
      distance: 'Direct Beach Access (100m)',
      pricePerNight: 4600,
      currency: 'INR',
      rating: 4.9,
      reviewsCount: 215,
      tier: 'Moderate',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      amenities: ['Oceanfront Pool', 'Artisan Breakfast', 'Spa & Wellness', 'Cocktail Lounge', 'Airport Shuttle'],
      description: 'Intimate boutique hotel with peaceful beachfront cabanas, artisan seafood dining, and sunset sea-view verandas.'
    },
    {
      id: 'h-goa-4',
      name: 'Anjuna Cliffside Eco Cottages',
      area: 'Anjuna (North Goa)',
      distance: '600m to Anjuna Flea Market & Beach',
      pricePerNight: 2100,
      currency: 'INR',
      rating: 4.7,
      reviewsCount: 184,
      tier: 'Budget',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
      amenities: ['Eco-friendly', 'Yoga Deck', 'Free Wi-Fi', 'Kitchenette', 'Pet Friendly'],
      description: 'Peaceful bohemian wooden chalets perched along the red laterite cliffside overlooking palm groves and surf breaks.'
    },
    {
      id: 'h-goa-5',
      name: 'Fontainhas Latin Heritage Quarter Inn',
      area: 'Panaji (Central Goa)',
      distance: 'Heart of Old Portuguese Quarter',
      pricePerNight: 3400,
      currency: 'INR',
      rating: 4.8,
      reviewsCount: 156,
      tier: 'Moderate',
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      amenities: ['Historic Architecture', 'Rooftop Cafe', 'Walking Tours', 'Free Wi-Fi', 'Library'],
      description: '18th-century restored mansion in the vibrant colorful streets of Fontainhas, steps away from Panaji cafes and art galleries.'
    },
    {
      id: 'h-goa-6',
      name: 'Taj Coastal Heritage Resort & Spa',
      area: 'Sinquerim / Fort Aguada',
      distance: 'Private Bay & Ramparts View',
      pricePerNight: 12500,
      currency: 'INR',
      rating: 4.9,
      reviewsCount: 520,
      tier: 'Luxury',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
      amenities: ['Infinity Bay Pool', 'Full-service Jiva Spa', 'Private Beach', 'Fine Dining Pavilions', 'Tennis Court'],
      description: 'World-renowned 5-star seaside resort built adjacent to historic Fort Aguada, delivering royal Goan hospitality.'
    }
  ],
  manali: [
    {
      id: 'h-manali-1',
      name: 'Snow Valley Panoramic Resort',
      area: 'Log Huts Area (Manali)',
      distance: '1.2 km from Mall Road',
      pricePerNight: 2900,
      currency: 'INR',
      rating: 4.8,
      reviewsCount: 410,
      tier: 'Moderate',
      image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80',
      amenities: ['Snow Peak Balcony', 'Central Heating', 'Multi-cuisine Dining', 'Game Room', 'Bonfire & Music'],
      description: 'Surrounded by pine and deodar forests with snow-capped Himalayan vistas and cozy heated alpine interiors.'
    },
    {
      id: 'h-manali-2',
      name: 'Old Manali Riverside Backpackers Hostel',
      area: 'Old Manali Village',
      distance: '300m to Manu Temple & Bohemian Cafes',
      pricePerNight: 850,
      currency: 'INR',
      rating: 4.6,
      reviewsCount: 320,
      tier: 'Budget',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
      amenities: ['River Stream View', 'High-speed Wi-Fi', 'Rooftop Cafe', 'Trek Gear Storage', 'Guitar Lounge'],
      description: 'Chill backpacker hostel right by the roaring Manalsu river with live acoustic sessions and traveler community.'
    },
    {
      id: 'h-manali-3',
      name: 'Solang Glacier Alpine Chalet & Lodge',
      area: 'Solang Valley',
      distance: '400m to Paragliding & Ski Slopes',
      pricePerNight: 4200,
      currency: 'INR',
      rating: 4.9,
      reviewsCount: 190,
      tier: 'Moderate',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
      amenities: ['Direct Ski Slope Access', 'Fireplace in Room', 'Hot Water 24/7', 'Snow Equipment Rental'],
      description: 'Exclusive mountain lodge nestled right in the heart of Solang Valley adventure action.'
    },
    {
      id: 'h-manali-4',
      name: 'The Himalayan Castle Luxury Resort',
      area: 'Hadimba Temple Road',
      distance: '500m to Hadimba Devi Temple',
      pricePerNight: 9800,
      currency: 'INR',
      rating: 4.9,
      reviewsCount: 260,
      tier: 'Luxury',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      amenities: ['Victorian Architecture', 'Heated Pool', 'Cedar Spa', 'Fine Wine Cellar', 'Private Orchards'],
      description: 'Victorian-style stone castle resort set amidst apple and cherry orchards with antique wood fireplaces.'
    },
    {
      id: 'h-manali-5',
      name: 'Vashisht Hot Springs Homestay',
      area: 'Vashisht Village',
      distance: '200m to Natural Thermal Sulfur Baths',
      pricePerNight: 1400,
      currency: 'INR',
      rating: 4.7,
      reviewsCount: 175,
      tier: 'Budget',
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      amenities: ['Rooftop Mountain View', 'Home-cooked Himachali Food', 'Thermal Bath Proximity', 'Wi-Fi'],
      description: 'Authentic wooden Himachali homestay offering organic local meals and rooftop valley views.'
    }
  ],
  paris: [
    {
      id: 'h-paris-1',
      name: 'Hotel Eiffel Rive Gauche',
      area: '7th Arrondissement (Eiffel Tower)',
      distance: '400m to Champ de Mars & Eiffel Tower',
      pricePerNight: 11500,
      currency: 'INR',
      rating: 4.8,
      reviewsCount: 380,
      tier: 'Moderate',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
      amenities: ['Eiffel Tower View', 'French Croissant Breakfast', 'Free Wi-Fi', 'Metro Proximity'],
      description: 'Classic Parisian boutique hotel just steps from the Eiffel Tower, surrounded by authentic bakeries and wine bars.'
    },
    {
      id: 'h-paris-2',
      name: 'Le Marais Artists Loft & Hotel',
      area: 'Le Marais (3rd Arrondissement)',
      distance: 'Heart of Historic Marais & Place des Vosges',
      pricePerNight: 8900,
      currency: 'INR',
      rating: 4.7,
      reviewsCount: 290,
      tier: 'Moderate',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      amenities: ['Courtyard Garden', 'Modern Art Suites', 'High-speed Wi-Fi', 'Boutique Coffee'],
      description: 'Hip Parisian hotel in the vibrant Marais quarter, walking distance from art galleries, fashion boutiques and cafes.'
    },
    {
      id: 'h-paris-3',
      name: 'Montmartre Bohemian Hostel & Cafe',
      area: 'Montmartre (18th Arrondissement)',
      distance: '500m to Sacré-Cœur Basilica',
      pricePerNight: 2800,
      currency: 'INR',
      rating: 4.5,
      reviewsCount: 620,
      tier: 'Budget',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
      amenities: ['Rooftop Terrace', 'Live Music', 'Kitchen', 'Free City Walking Tour'],
      description: 'Lively, artistic budget stay with panoramic rooftop views overlooking the Paris skyline and Sacré-Cœur.'
    },
    {
      id: 'h-paris-4',
      name: 'The Ritz Paris Historic Palace',
      area: 'Place Vendôme (1st Arrondissement)',
      distance: 'Adjacent to Louvre & Tuileries Garden',
      pricePerNight: 48000,
      currency: 'INR',
      rating: 4.9,
      reviewsCount: 410,
      tier: 'Luxury',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
      amenities: ['Michelin Star Dining', 'Chanel Spa', 'Private Gardens', 'Historic Bar Hemingway'],
      description: 'Legendary luxury palace hotel offering the pinnacle of French elegance and haute couture hospitality.'
    }
  ],
  tokyo: [
    {
      id: 'h-tokyo-1',
      name: 'Shinjuku Neon Skyline Hotel',
      area: 'Shinjuku (Kabukicho Area)',
      distance: '450m to Shinjuku Station',
      pricePerNight: 6800,
      currency: 'INR',
      rating: 4.8,
      reviewsCount: 540,
      tier: 'Moderate',
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
      amenities: ['City Skyline View', 'Japanese Onsen Bath', 'Free Wi-Fi', 'Subway Proximity'],
      description: 'Sleek, high-tech modern hotel in vibrant Shinjuku, surrounded by izakayas, ramen shops and neon streets.'
    },
    {
      id: 'h-tokyo-2',
      name: 'Asakusa Traditional Ryokan & Tea House',
      area: 'Asakusa (Old Tokyo)',
      distance: '300m to Sensō-ji Ancient Temple',
      pricePerNight: 4200,
      currency: 'INR',
      rating: 4.9,
      reviewsCount: 380,
      tier: 'Moderate',
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      amenities: ['Tatami Mat Rooms', 'Green Tea Ceremonies', 'Kimono Rental', 'Japanese Garden'],
      description: 'Authentic traditional Japanese inn featuring tatami flooring, hot cypress baths, and matcha ceremonies.'
    },
    {
      id: 'h-tokyo-3',
      name: 'Shibuya Capsule & Pod Explorer Hotel',
      area: 'Shibuya Crossing',
      distance: '200m to Shibuya Scramble Crossing',
      pricePerNight: 2200,
      currency: 'INR',
      rating: 4.6,
      reviewsCount: 890,
      tier: 'Budget',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
      amenities: ['Futuristic Pods', 'High-Speed Wi-Fi', 'Lounge & Working Space', 'Sauna'],
      description: 'Futuristic Japanese capsule hotel with smart ambient lighting, soundproofing, and immediate subway access.'
    },
    {
      id: 'h-tokyo-4',
      name: 'The Imperial Tokyo Bay Suites',
      area: 'Hibiya (Near Ginza)',
      distance: '1 km to Tokyo Imperial Palace',
      pricePerNight: 28500,
      currency: 'INR',
      rating: 4.9,
      reviewsCount: 620,
      tier: 'Luxury',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
      amenities: ['Palace Garden Views', 'Luxury Spa', 'Fine Japanese Dining', 'Concierge Service', 'Indoor Pool'],
      description: 'An upscale Tokyo stay with refined suites, attentive service, and convenient access to Ginza and the Imperial Palace.'
    }
  ],
  jaipur: [
    {
      id: 'h-jaipur-1',
      name: 'Umaid Bhawan Heritage Haveli',
      area: 'Bani Park (Jaipur)',
      distance: '1.5 km to City Palace & Pink City',
      pricePerNight: 3200,
      currency: 'INR',
      rating: 4.8,
      reviewsCount: 420,
      tier: 'Moderate',
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      amenities: ['Rajasthani Architecture', 'Swimming Pool', 'Rooftop Puppet Show', 'Free Breakfast'],
      description: 'Exquisite Rajput haveli decorated with classic frescoes, carved courtyards, and rooftop folk performances.'
    },
    {
      id: 'h-jaipur-2',
      name: 'Zostel Jaipur Pink City Backpacker Hub',
      area: 'Pink City / Hawa Mahal Road',
      distance: '300m to Hawa Mahal (Palace of Winds)',
      pricePerNight: 750,
      currency: 'INR',
      rating: 4.7,
      reviewsCount: 650,
      tier: 'Budget',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
      amenities: ['Rooftop Cafe with Hawa Mahal View', 'Social Common Room', 'AC Dorms', 'Walking Tours'],
      description: 'Lively backpacker hub right inside Jaipur’s historic walled Pink City, steps from bustling spice bazaars.'
    },
    {
      id: 'h-jaipur-3',
      name: 'Rambagh Palace - Royal Heritage Estate',
      area: 'Bhawani Singh Road (Central Jaipur)',
      distance: 'Former Residence of the Maharaja of Jaipur',
      pricePerNight: 28000,
      currency: 'INR',
      rating: 4.9,
      reviewsCount: 390,
      tier: 'Luxury',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
      amenities: ['47-Acre Mughal Gardens', 'Peacock Lawns', 'Polo Lounge', 'Royal Spa'],
      description: 'The Jewel of Jaipur — an authentic 1835 royal palace hotel offering regal Maharaja-style suites.'
    }
  ],
  kerala: [
    {
      id: 'h-kerala-1',
      name: 'Munnar Tea Valley Cloud Mist Resort',
      area: 'Munnar (Tea Estate Slopes)',
      distance: 'Surrounded by organic tea gardens',
      pricePerNight: 2700,
      currency: 'INR',
      rating: 4.8,
      reviewsCount: 340,
      tier: 'Moderate',
      image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80',
      amenities: ['Tea Plantation Walk', 'Mountain Balcony', 'Ayurvedic Spa', 'Kerala Dining'],
      description: 'Perched along misty emerald tea plantations, offering crisp mountain air and Ayurvedic rejuvenation.'
    },
    {
      id: 'h-kerala-2',
      name: 'Alleppey Luxury Backwaters Houseboat',
      area: 'Alleppey (Punnamada Backwaters)',
      distance: 'Cruising through palm-fringed canals',
      pricePerNight: 6500,
      currency: 'INR',
      rating: 4.9,
      reviewsCount: 510,
      tier: 'Moderate',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      amenities: ['Private Chef & Crew', 'AC Bedrooms', 'Canal Sunset Cruise', 'Traditional Karimeen Fry'],
      description: 'Traditional thatched Kettuvallam houseboat gliding past village backwaters with authentic Kerala seafood.'
    },
    {
      id: 'h-kerala-3',
      name: 'Fort Kochi Colonial Heritage Inn',
      area: 'Fort Kochi (Historical Quarter)',
      distance: '200m to Chinese Fishing Nets',
      pricePerNight: 1900,
      currency: 'INR',
      rating: 4.7,
      reviewsCount: 280,
      tier: 'Budget',
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      amenities: ['Colonial Courtyard', 'Kathakali Proximity', 'Bicycle Tours', 'Seafood Cafe'],
      description: 'Dutch-colonial boutique homestay nestled amongst centuries-old rain trees and historic spice streets.'
    },
    {
      id: 'h-kerala-4',
      name: 'Vembanad Lakefront Palace Resort',
      area: 'Kumarakom (Vembanad Lake)',
      distance: 'Private lakefront on Vembanad Lake',
      pricePerNight: 22500,
      currency: 'INR',
      rating: 4.9,
      reviewsCount: 460,
      tier: 'Luxury',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
      amenities: ['Private Pool Villas', 'Ayurvedic Spa', 'Lake Cruises', 'Kerala Fine Dining', 'Butler Service'],
      description: 'A premium backwater retreat with private villas, lake views, and curated wellness and dining experiences.'
    }
  ]
};

// @route   GET /api/v1/hotels
// @desc    Get surrounding hotels specifically matching destination & budget
router.get('/', (req, res) => {
  const { destination = 'Goa', maxBudget, area, tier } = req.query;
  const requestedDestination = typeof destination === 'string' ? destination.trim() : 'Goa';
  const destinationKey = DESTINATION_ALIASES.get(normalizeDestination(requestedDestination));
  const destinationHotels = destinationKey ? HOTELS_DATABASE[destinationKey] : [];
  let matchedHotels = destinationHotels;
  const isCuratedDestination = Boolean(destinationKey);

  if (tier && tier !== 'All') {
    const allowedTiers = ['Budget', 'Moderate', 'Luxury'];
    if (!allowedTiers.includes(tier)) {
      return res.status(400).json({ success: false, message: 'Choose Budget, Moderate, Luxury, or All hotel tiers.' });
    }
    matchedHotels = matchedHotels.filter((hotel) => hotel.tier === tier);
  }

  // Filter by budget if provided
  if (maxBudget !== undefined) {
    const limit = Number(maxBudget);
    if (!Number.isFinite(limit) || limit <= 0) {
      return res.status(400).json({ success: false, message: 'Enter a valid maximum nightly budget.' });
    }
    matchedHotels = matchedHotels.filter(h => h.pricePerNight <= limit);
  }

  // Filter by area if provided
  if (area && area !== 'All') {
    matchedHotels = matchedHotels.filter(h => h.area.toLowerCase().includes(area.toLowerCase()));
  }

  // Keep neighborhoods stable as the user changes tier, budget, or area filters.
  const distinctAreas = ['All', ...new Set(destinationHotels.map(h => h.area.split('(')[0].trim()))];

  res.json({
    success: true,
    destination: requestedDestination || 'Goa',
    curated: isCuratedDestination,
    searchUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`hotels in ${requestedDestination || 'Goa'}`)}`,
    areas: distinctAreas,
    totalAvailable: matchedHotels.length,
    hotels: matchedHotels
  });
});

module.exports = router;
