export const DESTINATIONS_DATA = {
  goa: {
    name: 'Goa',
    country: 'India',
    itineraryDays: [
      {
        dayNumber: 1,
        title: 'Arrival & North Goa Coast',
        activities: [
          { id: 'a1', title: 'Check-in at Sea Breeze Villa', timeSlot: 'Afternoon', startTime: '13:00', endTime: '14:30', category: 'Relaxation', location: 'Calangute, Goa', cost: 0, votes: 4 },
          { id: 'a2', title: 'Calangute Beach Walk & Fresh Coconuts', timeSlot: 'Afternoon', startTime: '15:00', endTime: '16:45', category: 'Beach', location: 'Calangute Beach', cost: 200, votes: 3 },
          { id: 'a3', title: 'Sunset Dinner at Thalassa Waterfront', timeSlot: 'Evening', startTime: '17:30', endTime: '20:30', category: 'Food & Dining', location: 'Siolim, Goa', cost: 2400, votes: 4 }
        ]
      },
      {
        dayNumber: 2,
        title: 'Historic Forts & Water Sports',
        activities: [
          { id: 'a4', title: 'Fort Aguada Lighthouse & Ramparts', timeSlot: 'Morning', startTime: '09:30', endTime: '11:45', category: 'Sightseeing', location: 'Sinquerim, Goa', cost: 300, votes: 4 },
          { id: 'a5', title: 'Baga Beach Scuba & Jet Ski Thrills', timeSlot: 'Afternoon', startTime: '13:00', endTime: '16:00', category: 'Adventure', location: 'Baga Beach', cost: 3500, votes: 3 },
          { id: 'a6', title: 'Anjuna Flea Market & Live Acoustic Bands', timeSlot: 'Evening', startTime: '17:30', endTime: '21:00', category: 'Culture', location: 'Anjuna, Goa', cost: 800, votes: 4 }
        ]
      },
      {
        dayNumber: 3,
        title: 'Waterfalls & Latin Quarter Heritage',
        activities: [
          { id: 'a7', title: 'Dudhsagar Falls Jungle Jeep Safari', timeSlot: 'Morning', startTime: '08:00', endTime: '13:30', category: 'Adventure', location: 'Bhagwan Mahaveer Sanctuary', cost: 2600, votes: 4 },
          { id: 'a8', title: 'Fontainhas Portuguese Latin Quarter Walk', timeSlot: 'Afternoon', startTime: '15:30', endTime: '18:00', category: 'Culture', location: 'Panaji, Goa', cost: 400, votes: 3 },
          { id: 'a9', title: 'Mandovi River Sunset Cruise & Goan Folk Dance', timeSlot: 'Evening', startTime: '18:45', endTime: '20:45', category: 'Sightseeing', location: 'Panaji Jetty', cost: 900, votes: 4 }
        ]
      }
    ],
    routeWaypoints: [
      { order: 1, name: 'Fort Aguada Lighthouse', lat: 15.492, lng: 73.773, type: 'Historic Vista', openHours: '09:00 - 17:30', timeAllocated: '2h' },
      { order: 2, name: 'Calangute Beach Promenade', lat: 15.543, lng: 73.755, type: 'Coastal Walk', openHours: '24/7', timeAllocated: '1.5h' },
      { order: 3, name: 'Baga Watersports Center', lat: 15.555, lng: 73.751, type: 'Adventure Hub', openHours: '09:00 - 18:00', timeAllocated: '3h' },
      { order: 4, name: 'Anjuna Sunset Cliffs Bistro', lat: 15.584, lng: 73.743, type: 'Dining & Sunset', openHours: '12:00 - 23:00', timeAllocated: '2.5h' }
    ],
    circuitDistance: '28.4 km',
    travelTime: '58 mins',
    routeSavings: '32% shorter',
    weatherInfo: {
      statusText: 'Warm Coastal & Breezy',
      riskLevel: 'Low Risk',
      weatherSummary: 'Average 31°C temperature with gentle 12 km/h Arabian sea breezes.',
      transportSummary: 'Normal transit — no bridge or highway closures across North or South Goa.',
      activitySummary: 'High tide after 5:00 PM — water sports optimal between 10:00 AM - 3:00 PM.',
      contingencyTip: 'Afternoon scattered cloudiness on Day 3. AI pre-scheduled Fontainhas indoor art galleries and indoor cafes.',
      forecast: [
        { day: 'Day 1', temp: '31°C', condition: 'Sunny & Coastal Breeze', rainProb: '10%', risk: 'Low' },
        { day: 'Day 2', temp: '30°C', condition: 'Clear Sky / Warm', rainProb: '15%', risk: 'Low' },
        { day: 'Day 3', temp: '29°C', condition: 'Afternoon Clouds & Mist', rainProb: '35%', risk: 'Moderate' },
        { day: 'Day 4', temp: '28°C', condition: 'Light Coastal Showers', rainProb: '45%', risk: 'Moderate' },
        { day: 'Day 5', temp: '31°C', condition: 'Sunny & Warm', rainProb: '5%', risk: 'Low' }
      ]
    }
  },
  manali: {
    name: 'Manali',
    country: 'India',
    itineraryDays: [
      {
        dayNumber: 1,
        title: 'Arrival & Cedar Forest Serenity',
        activities: [
          { id: 'm1', title: 'Check-in at Snow Valley Alpine Chalet', timeSlot: 'Afternoon', startTime: '13:00', endTime: '14:30', category: 'Relaxation', location: 'Log Huts, Manali', cost: 0, votes: 4 },
          { id: 'm2', title: 'Hadimba Devi Ancient Pine Temple Walk', timeSlot: 'Afternoon', startTime: '15:30', endTime: '17:30', category: 'Culture', location: 'Hadimba Road', cost: 100, votes: 4 },
          { id: 'm3', title: 'Old Manali Bohemian Cafes & Trout Dinner', timeSlot: 'Evening', startTime: '18:30', endTime: '21:00', category: 'Food & Dining', location: 'Old Manali', cost: 1600, votes: 4 }
        ]
      },
      {
        dayNumber: 2,
        title: 'High Altitude Glaciers & Paragliding',
        activities: [
          { id: 'm4', title: 'Solang Valley Paragliding & Ropeway', timeSlot: 'Morning', startTime: '09:00', endTime: '13:00', category: 'Adventure', location: 'Solang Valley', cost: 3200, votes: 4 },
          { id: 'm5', title: 'Anjani Mahadev Waterfall Snow Trek', timeSlot: 'Afternoon', startTime: '14:00', endTime: '16:30', category: 'Adventure', location: 'Solang Slopes', cost: 400, votes: 3 },
          { id: 'm6', title: 'Vashisht Natural Thermal Sulfur Baths', timeSlot: 'Evening', startTime: '17:30', endTime: '19:30', category: 'Relaxation', location: 'Vashisht Village', cost: 200, votes: 4 }
        ]
      },
      {
        dayNumber: 3,
        title: 'Alpine Trails & Naggar Castle Heritage',
        activities: [
          { id: 'm7', title: 'Jogini Waterfalls Pine Forest Trek', timeSlot: 'Morning', startTime: '08:30', endTime: '12:30', category: 'Adventure', location: 'Vashisht Ridge', cost: 300, votes: 4 },
          { id: 'm8', title: 'Naggar Castle Wood & Stone Heritage Tour', timeSlot: 'Afternoon', startTime: '14:00', endTime: '16:30', category: 'Culture', location: 'Naggar Village', cost: 300, votes: 3 },
          { id: 'm9', title: 'Mall Road Stroll, Woolens & Live Acoustic Bar', timeSlot: 'Evening', startTime: '18:00', endTime: '21:00', category: 'Relaxation', location: 'The Mall, Manali', cost: 800, votes: 4 }
        ]
      }
    ],
    routeWaypoints: [
      { order: 1, name: 'Hadimba Devi Temple Woods', lat: 32.248, lng: 77.170, type: 'Historic Cedar Woods', openHours: '08:00 - 18:00', timeAllocated: '2h' },
      { order: 2, name: 'Vashisht Hot Springs & Village', lat: 32.263, lng: 77.189, type: 'Thermal Springs', openHours: '07:00 - 19:00', timeAllocated: '1.5h' },
      { order: 3, name: 'Solang Valley Adventure & Paragliding', lat: 32.316, lng: 77.157, type: 'Alpine Adventure Hub', openHours: '09:00 - 17:00', timeAllocated: '3.5h' },
      { order: 4, name: 'Old Manali Riverside Bridge & Cafes', lat: 32.257, lng: 77.174, type: 'Dining & Sunset Vistas', openHours: '12:00 - 23:00', timeAllocated: '2.5h' }
    ],
    circuitDistance: '34.2 km',
    travelTime: '1h 15m',
    routeSavings: '28% shorter mountain transit',
    weatherInfo: {
      statusText: 'Crisp Mountain Breeze & Cool',
      riskLevel: 'Moderate (Alpine Altitude)',
      weatherSummary: 'Average 16°C temperature with crisp Himalayan mountain breezes. Cool evenings dipping to 8°C.',
      transportSummary: 'Manali-Leh / Rohtang Highway open with standard mountain passes. Low traffic congestion.',
      activitySummary: 'Paragliding and high treks strictly optimal before 1:30 PM prior to afternoon mountain thermal shifts.',
      contingencyTip: 'Occasional mountain showers forecast on Day 3. Warm layers and rain jackets advised for Solang Valley.',
      forecast: [
        { day: 'Day 1', temp: '17°C', condition: 'Sunny & Crisp Air', rainProb: '10%', risk: 'Low' },
        { day: 'Day 2', temp: '16°C', condition: 'Clear Mountain Sky', rainProb: '15%', risk: 'Low' },
        { day: 'Day 3', temp: '14°C', condition: 'Afternoon Cloud & Light Mist', rainProb: '40%', risk: 'Moderate' },
        { day: 'Day 4', temp: '13°C', condition: 'Scattered Mountain Rain', rainProb: '55%', risk: 'Moderate' },
        { day: 'Day 5', temp: '16°C', condition: 'Sunny & Clear Vistas', rainProb: '10%', risk: 'Low' }
      ]
    }
  },
  paris: {
    name: 'Paris',
    country: 'France',
    itineraryDays: [
      {
        dayNumber: 1,
        title: 'Arrival & Seine River Romance',
        activities: [
          { id: 'p1', title: 'Check-in at Hotel Eiffel Rive Gauche', timeSlot: 'Afternoon', startTime: '13:00', endTime: '14:30', category: 'Relaxation', location: '7th Arrondissement', cost: 0, votes: 4 },
          { id: 'p2', title: 'Champ de Mars & Eiffel Tower Lawn Stroll', timeSlot: 'Afternoon', startTime: '15:30', endTime: '17:30', category: 'Sightseeing', location: 'Eiffel Tower', cost: 350, votes: 4 },
          { id: 'p3', title: 'Seine River Sunset Gourmet Dinner Cruise', timeSlot: 'Evening', startTime: '18:30', endTime: '21:00', category: 'Food & Dining', location: 'Pont de l’Alma', cost: 4200, votes: 4 }
        ]
      },
      {
        dayNumber: 2,
        title: 'Louvre Art & Historic Palaces',
        activities: [
          { id: 'p4', title: 'Louvre Museum Renaissance Masterpieces', timeSlot: 'Morning', startTime: '09:30', endTime: '13:00', category: 'Culture', location: 'Palais du Louvre', cost: 1900, votes: 4 },
          { id: 'p5', title: 'Tuileries Garden & Angelina Hot Chocolate', timeSlot: 'Afternoon', startTime: '14:00', endTime: '16:00', category: 'Food & Dining', location: 'Rue de Rivoli', cost: 950, votes: 3 },
          { id: 'p6', title: 'Montmartre Artists Square & Sacré-Cœur Sunset', timeSlot: 'Evening', startTime: '17:30', endTime: '20:30', category: 'Culture', location: 'Place du Tertre', cost: 300, votes: 4 }
        ]
      },
      {
        dayNumber: 3,
        title: 'Notre-Dame, Latin Quarter & Le Marais',
        activities: [
          { id: 'p7', title: 'Notre-Dame Cathedral & Île de la Cité Walk', timeSlot: 'Morning', startTime: '09:30', endTime: '12:00', category: 'Sightseeing', location: 'Île de la Cité', cost: 0, votes: 4 },
          { id: 'p8', title: 'Latin Quarter Shakespeare & Co. Bookshop', timeSlot: 'Afternoon', startTime: '13:30', endTime: '16:00', category: 'Culture', location: 'Rue de la Bûcherie', cost: 400, votes: 3 },
          { id: 'p9', title: 'Le Marais Boutique Wine Tasting & Bistro', timeSlot: 'Evening', startTime: '17:30', endTime: '21:00', category: 'Food & Dining', location: 'Place des Vosges', cost: 2800, votes: 4 }
        ]
      }
    ],
    routeWaypoints: [
      { order: 1, name: 'Palais du Louvre & Courtyard Pyramid', lat: 48.860, lng: 2.337, type: 'Art & Museum Heritage', openHours: '09:00 - 18:00', timeAllocated: '3h' },
      { order: 2, name: 'Notre-Dame & Seine River Promenade', lat: 48.853, lng: 2.349, type: 'Historic Island Walk', openHours: '24/7', timeAllocated: '1.5h' },
      { order: 3, name: 'Eiffel Tower & Champ de Mars Grounds', lat: 48.858, lng: 2.294, type: 'Iconic Global Landmark', openHours: '09:30 - 23:45', timeAllocated: '2.5h' },
      { order: 4, name: 'Montmartre Sacré-Cœur Sunset Terrace', lat: 48.886, lng: 2.343, type: 'Panoramic Cityscape View', openHours: '06:00 - 22:30', timeAllocated: '2h' }
    ],
    circuitDistance: '14.8 km',
    travelTime: '38 mins (Metro/Transit)',
    routeSavings: '35% faster via Metro RER',
    weatherInfo: {
      statusText: 'Mild & Pleasant Autumn',
      riskLevel: 'Low Risk',
      weatherSummary: 'Average 19°C temperature with soft overcast skies and gentle 9 km/h Parisian breeze.',
      transportSummary: 'Paris Metro RER and Batobus river ferries operating with full on-time schedule.',
      activitySummary: 'Louvre and Eiffel Tower elevator bookings recommended in advance to skip queue lines.',
      contingencyTip: 'Occasional light drizzle on Day 3. Perfect for sheltered gallery walks in Covered Passages & Le Marais.',
      forecast: [
        { day: 'Day 1', temp: '20°C', condition: 'Partly Cloudy & Mild', rainProb: '10%', risk: 'Low' },
        { day: 'Day 2', temp: '19°C', condition: 'Sunny & Pleasant', rainProb: '15%', risk: 'Low' },
        { day: 'Day 3', temp: '18°C', condition: 'Light Autumn Drizzle', rainProb: '40%', risk: 'Low' },
        { day: 'Day 4', temp: '17°C', condition: 'Overcast & Cool', rainProb: '25%', risk: 'Low' },
        { day: 'Day 5', temp: '19°C', condition: 'Crisp & Sunny', rainProb: '10%', risk: 'Low' }
      ]
    }
  },
  tokyo: {
    name: 'Tokyo',
    country: 'Japan',
    itineraryDays: [
      {
        dayNumber: 1,
        title: 'Arrival & Shinjuku Neon Nightscape',
        activities: [
          { id: 't1', title: 'Check-in at Shinjuku Skyline Hotel', timeSlot: 'Afternoon', startTime: '13:00', endTime: '14:30', category: 'Relaxation', location: 'Kabukicho, Shinjuku', cost: 0, votes: 4 },
          { id: 't2', title: 'Shinjuku Gyoen National Garden Stroll', timeSlot: 'Afternoon', startTime: '15:00', endTime: '17:00', category: 'Relaxation', location: 'Shinjuku Gyoen', cost: 350, votes: 4 },
          { id: 't3', title: 'Omoide Yokocho Yakitori & Ramen Alley', timeSlot: 'Evening', startTime: '18:00', endTime: '20:30', category: 'Food & Dining', location: 'Memory Lane', cost: 1800, votes: 4 }
        ]
      },
      {
        dayNumber: 2,
        title: 'Ancient Temples & Electronic Towns',
        activities: [
          { id: 't4', title: 'Sensō-ji Temple & Asakusa Nakamise Bazaar', timeSlot: 'Morning', startTime: '09:00', endTime: '12:00', category: 'Culture', location: 'Asakusa', cost: 200, votes: 4 },
          { id: 't5', title: 'Akihabara Electric Town & Arcade Games', timeSlot: 'Afternoon', startTime: '13:30', endTime: '16:30', category: 'Adventure', location: 'Akihabara', cost: 1200, votes: 3 },
          { id: 't6', title: 'Tokyo Skytree Panoramic Sunset Deck', timeSlot: 'Evening', startTime: '17:30', endTime: '20:00', category: 'Sightseeing', location: 'Oshiage', cost: 2200, votes: 4 }
        ]
      },
      {
        dayNumber: 3,
        title: 'Shibuya Scramble & Meiji Shrine Serenity',
        activities: [
          { id: 't7', title: 'Meiji Jingu Shinto Shrine Sacred Forest Walk', timeSlot: 'Morning', startTime: '09:00', endTime: '11:30', category: 'Culture', location: 'Harajuku', cost: 0, votes: 4 },
          { id: 't8', title: 'Harajuku Takeshita Street Crepes & Fashion', timeSlot: 'Afternoon', startTime: '12:30', endTime: '15:30', category: 'Food & Dining', location: 'Takeshita-dori', cost: 850, votes: 3 },
          { id: 't9', title: 'Shibuya Scramble Crossing & Shibuya Sky View', timeSlot: 'Evening', startTime: '16:30', endTime: '20:30', category: 'Sightseeing', location: 'Shibuya Crossing', cost: 1600, votes: 4 }
        ]
      }
    ],
    routeWaypoints: [
      { order: 1, name: 'Sensō-ji Temple & Asakusa Pagoda', lat: 35.714, lng: 139.796, type: 'Ancient Buddhist Shrine', openHours: '06:00 - 17:00', timeAllocated: '2.5h' },
      { order: 2, name: 'Akihabara Tech & Manga Boulevard', lat: 35.698, lng: 139.771, type: 'Futuristic Electronics Hub', openHours: '10:00 - 21:00', timeAllocated: '2h' },
      { order: 3, name: 'Meiji Shrine & Harajuku Forest', lat: 35.676, lng: 139.699, type: 'Sacred Evergreen Sanctuary', openHours: '06:00 - 18:00', timeAllocated: '2h' },
      { order: 4, name: 'Shibuya Crossing & Sky Rooftop', lat: 35.659, lng: 139.700, type: 'Global Urban Center', openHours: '10:00 - 22:30', timeAllocated: '2.5h' }
    ],
    circuitDistance: '18.2 km',
    travelTime: '42 mins (JR Yamanote Line)',
    routeSavings: '38% saved via Yamanote Line',
    weatherInfo: {
      statusText: 'Clear, Fresh & Favorable',
      riskLevel: 'Low Risk',
      weatherSummary: 'Average 21°C temperature with crisp sunny conditions and negligible humidity.',
      transportSummary: 'Tokyo Metro and JR Yamanote rail running with 99.8% on-time precision.',
      activitySummary: 'All outdoor walking shrines and rooftop observatories operate under prime visibility.',
      contingencyTip: 'Suica/Pasmo IC cards make transit seamless across all Tokyo districts.',
      forecast: [
        { day: 'Day 1', temp: '22°C', condition: 'Sunny & Crisp', rainProb: '5%', risk: 'Low' },
        { day: 'Day 2', temp: '21°C', condition: 'Clear Skies', rainProb: '10%', risk: 'Low' },
        { day: 'Day 3', temp: '20°C', condition: 'Mild Autumn Breeze', rainProb: '15%', risk: 'Low' },
        { day: 'Day 4', temp: '19°C', condition: 'Partly Cloudy', rainProb: '20%', risk: 'Low' },
        { day: 'Day 5', temp: '22°C', condition: 'Bright & Favorable', rainProb: '5%', risk: 'Low' }
      ]
    }
  },
  jaipur: {
    name: 'Jaipur',
    country: 'India',
    itineraryDays: [
      {
        dayNumber: 1,
        title: 'Arrival & Walled Pink City Bazaars',
        activities: [
          { id: 'j1', title: 'Check-in at Umaid Bhawan Heritage Haveli', timeSlot: 'Afternoon', startTime: '13:00', endTime: '14:30', category: 'Relaxation', location: 'Bani Park, Jaipur', cost: 0, votes: 4 },
          { id: 'j2', title: 'Hawa Mahal (Palace of Winds) Street Walk', timeSlot: 'Afternoon', startTime: '15:30', endTime: '17:30', category: 'Culture', location: 'Pink City Badi Chaupar', cost: 200, votes: 4 },
          { id: 'j3', title: 'LMB Traditional Rajasthani Thali Feast', timeSlot: 'Evening', startTime: '18:30', endTime: '20:30', category: 'Food & Dining', location: 'Johari Bazaar', cost: 1100, votes: 4 }
        ]
      },
      {
        dayNumber: 2,
        title: 'Amber Fort Royalty & Sunset Ramparts',
        activities: [
          { id: 'j4', title: 'Amber Fort Sheesh Mahal (Mirror Palace)', timeSlot: 'Morning', startTime: '09:00', endTime: '13:00', category: 'Culture', location: 'Amer, Jaipur', cost: 500, votes: 4 },
          { id: 'j5', title: 'Jal Mahal (Water Palace) Photo Overlook', timeSlot: 'Afternoon', startTime: '14:00', endTime: '15:30', category: 'Sightseeing', location: 'Man Sagar Lake', cost: 0, votes: 3 },
          { id: 'j6', title: 'Nahargarh Fort Sunset Point with City Views', timeSlot: 'Evening', startTime: '16:30', endTime: '19:30', category: 'Sightseeing', location: 'Aravalli Hills', cost: 350, votes: 4 }
        ]
      },
      {
        dayNumber: 3,
        title: 'Royal Observatories & Handblock Textiles',
        activities: [
          { id: 'j7', title: 'Jantar Mantar Astronomical Sundials Tour', timeSlot: 'Morning', startTime: '09:30', endTime: '11:45', category: 'Culture', location: 'City Palace Complex', cost: 200, votes: 4 },
          { id: 'j8', title: 'City Palace Museum & Peacock Courtyard', timeSlot: 'Afternoon', startTime: '12:30', endTime: '15:00', category: 'Culture', location: 'Tripolia Bazaar', cost: 700, votes: 4 },
          { id: 'j9', title: 'Chokhi Dhani Cultural Village & Folk Dance', timeSlot: 'Evening', startTime: '17:30', endTime: '21:30', category: 'Culture', location: 'Tonk Road', cost: 1400, votes: 4 }
        ]
      }
    ],
    routeWaypoints: [
      { order: 1, name: 'Amber Palace & Sheesh Mahal', lat: 26.985, lng: 75.851, type: 'Historic Hilltop Fortress', openHours: '08:00 - 18:00', timeAllocated: '3h' },
      { order: 2, name: 'Jal Mahal Water Palace Promenade', lat: 26.953, lng: 75.846, type: 'Lakeside Photography', openHours: '24/7', timeAllocated: '1h' },
      { order: 3, name: 'Hawa Mahal & City Palace Complex', lat: 26.923, lng: 75.826, type: 'Pink City Architecture', openHours: '09:00 - 17:00', timeAllocated: '2.5h' },
      { order: 4, name: 'Nahargarh Fort Sunset Ridge', lat: 26.937, lng: 75.815, type: 'Aravalli Hills Sunset', openHours: '10:00 - 22:00', timeAllocated: '2h' }
    ],
    circuitDistance: '24.6 km',
    travelTime: '52 mins',
    routeSavings: '30% avoided traffic detours',
    weatherInfo: {
      statusText: 'Warm Desert Sun & Clear',
      riskLevel: 'Low Risk',
      weatherSummary: 'Average 32°C temperature with dry warm sunshine and pleasant evening breezes.',
      transportSummary: 'Amer Highway and Pink City e-rickshaws operating smoothly with no disruptions.',
      activitySummary: 'Amber Fort exploration recommended in the morning hours to avoid midday sun.',
      contingencyTip: 'Comfortable walking shoes and hydration recommended for hilltop fort cobblestones.',
      forecast: [
        { day: 'Day 1', temp: '33°C', condition: 'Sunny & Warm', rainProb: '0%', risk: 'Low' },
        { day: 'Day 2', temp: '32°C', condition: 'Clear Desert Sky', rainProb: '0%', risk: 'Low' },
        { day: 'Day 3', temp: '31°C', condition: 'Pleasant & Sunny', rainProb: '5%', risk: 'Low' },
        { day: 'Day 4', temp: '32°C', condition: 'Warm Breeze', rainProb: '0%', risk: 'Low' },
        { day: 'Day 5', temp: '34°C', condition: 'Bright Sunshine', rainProb: '0%', risk: 'Low' }
      ]
    }
  }
};

export function normalizeDestinationName(destinationName = '') {
  const clean = destinationName.trim();
  if (/^(monali|manaly)$/i.test(clean)) return 'Manali';
  return clean;
}

// Unknown destinations should not be presented as if they had verified local data.
export function getDestinationData(destinationName = '') {
  const canonicalDestination = normalizeDestinationName(destinationName);
  if (!canonicalDestination) {
    return {
      name: '',
      country: 'Custom Destination',
      itineraryDays: [],
      routeWaypoints: [],
      circuitDistance: '',
      travelTime: '',
      routeSavings: '',
      weatherInfo: { forecast: [] }
    };
  }
  const norm = canonicalDestination.toLowerCase().trim();
  if (norm.includes('manali') || norm.includes('himachal')) return DESTINATIONS_DATA.manali;
  if (norm.includes('paris') || norm.includes('france')) return DESTINATIONS_DATA.paris;
  if (norm.includes('tokyo') || norm.includes('japan')) return DESTINATIONS_DATA.tokyo;
  if (norm.includes('jaipur') || norm.includes('rajasthan')) return DESTINATIONS_DATA.jaipur;
  if (norm.includes('goa')) return DESTINATIONS_DATA.goa;

  const clean = canonicalDestination || 'Your destination';
  return {
    name: clean,
    country: 'Custom Destination',
    itineraryDays: [
      {
        dayNumber: 1,
        title: `Find verified places in ${clean}`,
        activities: [
          { id: 'c1', title: `Search for a verified attraction in ${clean}`, timeSlot: 'Morning', startTime: '09:00', endTime: '12:00', category: 'Sightseeing', location: clean, cost: null, votes: 0 },
          { id: 'c2', title: `Find a restaurant with recent reviews in ${clean}`, timeSlot: 'Afternoon', startTime: '12:30', endTime: '14:00', category: 'Food & Dining', location: clean, cost: null, votes: 0 },
          { id: 'c3', title: `Choose a public evening stop in ${clean}`, timeSlot: 'Evening', startTime: '16:30', endTime: '19:00', category: 'Relaxation', location: clean, cost: null, votes: 0 }
        ]
      },
      {
        dayNumber: 2,
        title: `Check local guides for ${clean}`,
        activities: [
          { id: 'c4', title: `Look up a museum or landmark in ${clean}`, timeSlot: 'Morning', startTime: '09:00', endTime: '12:00', category: 'Culture', location: clean, cost: null, votes: 0 },
          { id: 'c5', title: `Explore regional food in ${clean}`, timeSlot: 'Afternoon', startTime: '12:30', endTime: '14:00', category: 'Food & Dining', location: clean, cost: null, votes: 0 },
          { id: 'c6', title: `Find a locally recommended evening area in ${clean}`, timeSlot: 'Evening', startTime: '16:30', endTime: '19:00', category: 'Sightseeing', location: clean, cost: null, votes: 0 }
        ]
      },
      {
        dayNumber: 3,
        title: `Verify activities and opening hours`,
        activities: [
          { id: 'c7', title: `Search for a verified outdoor activity in ${clean}`, timeSlot: 'Morning', startTime: '09:00', endTime: '12:00', category: 'Adventure', location: clean, cost: null, votes: 0 },
          { id: 'c8', title: `Check local dining guides for ${clean}`, timeSlot: 'Afternoon', startTime: '12:30', endTime: '14:00', category: 'Food & Dining', location: clean, cost: null, votes: 0 },
          { id: 'c9', title: `Confirm a safe public evening visit in ${clean}`, timeSlot: 'Evening', startTime: '16:30', endTime: '19:00', category: 'Relaxation', location: clean, cost: null, votes: 0 }
        ]
      }
    ],
    routeWaypoints: [],
    circuitDistance: 'Unavailable',
    travelTime: 'Unavailable',
    routeSavings: 'Add verified places to calculate a route',
    weatherInfo: {
      statusText: 'No curated weather data',
      riskLevel: 'Check local advisories',
      weatherSummary: `Check a current weather service for ${clean} before planning outdoor activities.`,
      transportSummary: `Check local transit and road updates for ${clean} before traveling.`,
      activitySummary: `Verify attraction hours and access with official ${clean} visitor information.`,
      contingencyTip: `No live forecast is available here for ${clean}. Check local weather and travel advisories.`,
      forecast: []
    }
  };
}
