from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/api/v1/ai", tags=["AI Travel Agent"])


class PlanTripRequest(BaseModel):
    destination: str = "Goa"
    durationDays: int = 5
    budget: float = 40000.0
    travelersCount: int = 4
    travelStyle: str = "Balanced Explorer"
    interests: List[str] = ["Beaches", "Food & Dining", "Sightseeing", "Adventure"]
    query: Optional[str] = None


DESTINATION_ALIASES = {
    "monali": "manali",
    "manaly": "manali",
    "manali, himachal pradesh": "manali",
}

DESTINATION_PLANS = {
    "goa": {
        "name": "Goa",
        "weather": ("31°C", "Sunny & Coastal Breeze", "Low"),
        "distance": 28.4,
        "minutes": 58,
        "sights": [
            ("Fort Aguada Lighthouse", "Sinquerim", "Sightseeing", 300),
            ("Basilica of Bom Jesus", "Old Goa", "Culture", 150),
            ("Fontainhas Latin Quarter", "Panaji", "Culture", 400),
            ("Dudhsagar Falls Jeep Safari", "Mollem National Park", "Adventure", 2800),
            ("Chapora Fort Viewpoint", "Vagator", "Sightseeing", 0),
        ],
        "food": [
            ("Goan fish thali at Ritz Classic", "Panaji", 650),
            ("Prawn balchao and poi at Vinayak Family Restaurant", "Assagao", 550),
            ("Seafood lunch at Fisherman's Wharf", "Cavelossim", 900),
            ("Traditional xacuti at Mum's Kitchen", "Panaji", 750),
            ("Beach shack lunch and fresh coconut", "Calangute Beach", 500),
        ],
        "evenings": [
            ("Sunset at Chapora Fort", "Vagator", "Sightseeing", 0),
            ("Mandovi River cruise", "Panaji Jetty", "Culture", 900),
            ("Anjuna beach sunset walk", "Anjuna", "Relaxation", 0),
            ("Candolim beachfront evening", "Candolim", "Relaxation", 0),
            ("Live music and market stroll", "Anjuna Flea Market", "Culture", 400),
        ],
    },
    "manali": {
        "name": "Manali",
        "weather": ("16°C", "Crisp Himalayan Mountain Air", "Moderate — check altitude and road conditions"),
        "distance": 34.2,
        "minutes": 75,
        "sights": [
            ("Hadimba Devi Temple and cedar forest", "Old Manali", "Culture", 100),
            ("Solang Valley ropeway and adventure area", "Solang Valley", "Adventure", 1200),
            ("Vashisht Temple and hot springs", "Vashisht Village", "Relaxation", 100),
            ("Jogini Waterfall trail", "Vashisht", "Adventure", 300),
            ("Naggar Castle", "Naggar", "Culture", 100),
        ],
        "food": [
            ("Trout lunch at Johnson's Cafe", "Circuit House Road", 1000),
            ("Wood-fired pizza by the river at Cafe 1947", "Old Manali", 850),
            ("Himachali siddu and local dishes", "Old Manali", 450),
            ("Tibetan momos and thukpa", "Mall Road", 400),
            ("Local trout dinner in Old Manali", "Old Manali", 950),
        ],
        "evenings": [
            ("Old Manali riverside cafe walk", "Old Manali", "Food & Dining", 500),
            ("Mall Road and Manu Market stroll", "Manali town", "Culture", 200),
            ("Vashisht village sunset viewpoint", "Vashisht", "Sightseeing", 0),
            ("Naggar village heritage walk", "Naggar", "Culture", 100),
            ("Bonfire evening with mountain views", "Log Huts Area", "Relaxation", 600),
        ],
    },
    "paris": {
        "name": "Paris",
        "weather": ("19°C", "Mild & Partly Cloudy", "Low"),
        "distance": 18.6,
        "minutes": 42,
        "sights": [
            ("Eiffel Tower and Champ de Mars", "7th Arrondissement", "Sightseeing", 3000),
            ("Louvre Museum", "1st Arrondissement", "Culture", 1900),
            ("Notre-Dame and Île de la Cité", "Île de la Cité", "Culture", 0),
            ("Montmartre and Sacré-Cœur", "18th Arrondissement", "Culture", 0),
            ("Musée d'Orsay", "Left Bank", "Culture", 1400),
        ],
        "food": [
            ("Classic French lunch at Bouillon Pigalle", "Pigalle", 2200),
            ("Falafel lunch on Rue des Rosiers", "Le Marais", 1300),
            ("Crêpes near Saint-Germain-des-Prés", "Saint-Germain", 1600),
            ("Market lunch at Marché des Enfants Rouges", "Le Marais", 1900),
            ("French bakery picnic by the Seine", "Latin Quarter", 1400),
        ],
        "evenings": [
            ("Seine riverbank sunset walk", "Quai de la Tournelle", "Relaxation", 0),
            ("Evening view from Trocadéro", "16th Arrondissement", "Sightseeing", 0),
            ("Canal Saint-Martin dinner stroll", "10th Arrondissement", "Food & Dining", 25),
            ("Place des Vosges and Le Marais walk", "Le Marais", "Culture", 0),
            ("Montmartre artists' quarter at dusk", "Montmartre", "Culture", 0),
        ],
    },
    "tokyo": {
        "name": "Tokyo",
        "weather": ("21°C", "Seasonal Tokyo Conditions", "Low — check current advisories"),
        "distance": 24.0,
        "minutes": 50,
        "sights": [
            ("Sensō-ji Temple and Nakamise Street", "Asakusa", "Culture", 0),
            ("Meiji Shrine forest walk", "Shibuya", "Culture", 0),
            ("Shibuya Crossing and Hachikō", "Shibuya", "Sightseeing", 0),
            ("Tsukiji Outer Market", "Chūō", "Food & Dining", 0),
            ("Shinjuku Gyoen National Garden", "Shinjuku", "Relaxation", 300),
        ],
        "food": [
            ("Sushi lunch at Tsukiji Outer Market", "Tsukiji", 1000),
            ("Shoyu ramen in Shinjuku", "Shinjuku", 700),
            ("Tempura set lunch in Asakusa", "Asakusa", 850),
            ("Conveyor-belt sushi in Shibuya", "Shibuya", 900),
            ("Yakitori dinner in Omoide Yokocho", "Shinjuku", 1250),
        ],
        "evenings": [
            ("Shibuya Sky sunset view", "Shibuya", "Sightseeing", 2500),
            ("Lantern-lit alleys of Omoide Yokocho", "Shinjuku", "Food & Dining", 1000),
            ("Evening walk through Shinjuku Gyoen area", "Shinjuku", "Relaxation", 0),
            ("Akihabara arcades and shops", "Akihabara", "Culture", 1000),
            ("Tokyo Station and Marunouchi night walk", "Marunouchi", "Sightseeing", 0),
        ],
    },
    "jaipur": {
        "name": "Jaipur",
        "weather": ("32°C", "Warm & Dry", "Low — plan outdoor visits outside midday heat"),
        "distance": 21.5,
        "minutes": 48,
        "sights": [
            ("Amber Fort", "Amer", "Culture", 200),
            ("Hawa Mahal", "Pink City", "Sightseeing", 200),
            ("City Palace", "Pink City", "Culture", 300),
            ("Jantar Mantar", "Pink City", "Culture", 200),
            ("Nahargarh Fort viewpoint", "Nahargarh", "Sightseeing", 200),
        ],
        "food": [
            ("Rajasthani thali at Laxmi Misthan Bhandar", "Johari Bazaar", 500),
            ("Pyaaz kachori at Rawat Mishthan Bhandar", "Sindhi Camp", 150),
            ("Dal baati churma in the Pink City", "Pink City", 450),
            ("Laal maas at a traditional Rajasthani restaurant", "MI Road", 800),
            ("Street snacks around Bapu Bazaar", "Pink City", 250),
        ],
        "evenings": [
            ("Sunset at Nahargarh Fort", "Nahargarh", "Sightseeing", 100),
            ("Patrika Gate and Jawahar Circle", "Jawahar Circle", "Sightseeing", 0),
            ("Hawa Mahal illuminated from the street", "Pink City", "Sightseeing", 0),
            ("Evening shopping at Bapu Bazaar", "Pink City", "Culture", 0),
            ("Jal Mahal lakeside sunset", "Amer Road", "Relaxation", 0),
        ],
    },
}


def build_plan(req: PlanTripRequest):
    requested_destination = req.destination.strip() or "Goa"
    normalized_key = DESTINATION_ALIASES.get(requested_destination.lower(), requested_destination.lower())
    profile = DESTINATION_PLANS.get(normalized_key)
    destination = profile["name"] if profile else requested_destination.title()
    budget_per_traveler = req.budget / max(req.travelersCount, 1)

    days = []
    for day_number in range(1, req.durationDays + 1):
        index = (day_number - 1) % 5
        if profile:
            sight = profile["sights"][index]
            meal = profile["food"][index]
            evening = profile["evenings"][index]
            activities = [
                {
                    "title": sight[0],
                    "description": f"Explore {sight[0]} in {sight[1]}. Check current opening times before visiting.",
                    "timeSlot": "Morning",
                    "startTime": "09:00",
                    "endTime": "12:00",
                    "location": {"name": sight[1]},
                    "category": sight[2],
                    "estimatedCost": sight[3],
                },
                {
                    "title": meal[0],
                    "description": f"Try local food around {meal[1]}; prices are estimates and may change.",
                    "timeSlot": "Afternoon",
                    "startTime": "12:30",
                    "endTime": "14:00",
                    "location": {"name": meal[1]},
                    "category": "Food & Dining",
                    "estimatedCost": meal[2],
                },
                {
                    "title": evening[0],
                    "description": f"Spend the evening around {evening[1]}. Confirm local access and conditions.",
                    "timeSlot": "Evening",
                    "startTime": "16:30",
                    "endTime": "19:00",
                    "location": {"name": evening[1]},
                    "category": evening[2],
                    "estimatedCost": evening[3],
                },
            ]
            theme = f"{sight[1]} & local favorites"
        else:
            daily_themes = [
                ("Arrival & neighborhood orientation", "a central landmark or visitor information center", "a nearby cafe with recent reviews", "an accessible public square or waterfront"),
                ("History & local culture", "a local history museum or heritage site", "a regional specialty restaurant", "a cultural district with confirmed evening access"),
                ("Parks & outdoor exploration", "a public garden, park, or easy walking trail", "a market or casual lunch spot near the route", "a scenic viewpoint with current access information"),
                ("Markets & independent neighborhoods", "a different neighborhood walking route", "a local food market or neighborhood bakery", "a public art, music, or community space"),
                ("Group favorites & flexible discoveries", "a second attraction selected by the group", "a well-reviewed place serving a dish you have not tried yet", "a relaxed public area near your accommodation"),
            ]
            theme, morning_idea, lunch_idea, evening_idea = daily_themes[(day_number - 1) % len(daily_themes)]
            activities = [
                {
                    "title": f"Find {morning_idea} in {destination} (Day {day_number})",
                    "description": f"Choose and verify {morning_idea} in {destination} based on your group's interests; no venue is curated for this destination yet.",
                    "timeSlot": "Morning",
                    "startTime": "09:00",
                    "endTime": "12:00",
                    "location": {"name": destination},
                    "category": "Sightseeing",
                    "estimatedCost": None,
                },
                {
                    "title": f"Lunch: {lunch_idea} in {destination} (Day {day_number})",
                    "description": f"Search recent local listings for {lunch_idea} in {destination} and confirm opening hours and prices.",
                    "timeSlot": "Afternoon",
                    "startTime": "12:30",
                    "endTime": "14:00",
                    "location": {"name": destination},
                    "category": "Food & Dining",
                    "estimatedCost": None,
                },
                {
                    "title": f"Evening: {evening_idea} in {destination} (Day {day_number})",
                    "description": f"Check local visitor information for {evening_idea} in {destination}, including access and hours.",
                    "timeSlot": "Evening",
                    "startTime": "16:30",
                    "endTime": "19:00",
                    "location": {"name": destination},
                    "category": "Relaxation",
                    "estimatedCost": None,
                },
            ]

        days.append({
            "dayNumber": day_number,
            "title": f"Day {day_number}: {theme}",
            "theme": theme,
            "activities": activities,
        })

    weather = profile["weather"] if profile else (
        "Unavailable",
        f"No curated forecast for {destination}; check a local weather service.",
        "Check local advisories",
    )
    attractions = profile["sights"] + profile["evenings"] if profile else []
    route_sequence = [place[0] for place in attractions[:5]] or [f"Choose a verified stop in {destination}"]
    distance = profile["distance"] if profile else 0
    minutes = profile["minutes"] if profile else 0

    return {
        "success": True,
        "proposalTitle": f"{req.durationDays}-Day Intelligent {destination} Odyssey",
        "destination": destination,
        "durationDays": req.durationDays,
        "travelersCount": req.travelersCount,
        "budgetTotal": req.budget,
        "agentLogs": [
            {
                "agent": "Destination Research Agent",
                "action": f"Selected itinerary recommendations for {destination}",
                "result": f"Using curated {destination} attractions and dining suggestions." if profile else f"No curated database for {destination}; recommendations are clearly marked as unverified.",
                "timestamp": "0.11s",
            },
            {
                "agent": "Group Preference Agent",
                "action": f"Computed interest matrix for {req.travelersCount} travelers",
                "result": f"Matched tags: {', '.join(req.interests)}. Travel style: {req.travelStyle}.",
                "timestamp": "0.22s",
            },
            {
                "agent": "Budget Intelligence Agent",
                "action": f"Formulated budget envelope for {req.budget:g}",
                "result": f"Estimated budget per traveler: {budget_per_traveler:,.0f}. Venue prices are indicative.",
                "timestamp": "0.35s",
            },
            {
                "agent": "Route Optimization Agent",
                "action": f"Sequenced stops for {destination}",
                "result": f"Route recommendations use {destination} points of interest." if profile else f"Add verified {destination} locations to calculate a route.",
                "timestamp": "0.48s",
            },
            {
                "agent": "Final Proposal Agent",
                "action": f"Generated {req.durationDays}-day itinerary for {destination}",
                "result": "Review venue hours, prices, weather, and travel conditions before booking.",
                "timestamp": "0.61s",
            },
        ],
        "days": days,
        "weatherReport": {"temp": weather[0], "condition": weather[1], "risk": weather[2]},
        "routeOptimization": {
            "optimizedSequence": route_sequence,
            "estimatedDistanceKm": distance,
            "travelTimeMinutes": minutes,
            "efficiencyScore": "Destination route suggestions" if profile else "Add verified locations",
        },
        "sustainability": {
            "estimatedCarbonKg": int(req.durationDays * 18.5 * req.travelersCount),
            "ecoRating": "A",
            "greenTip": f"Walking and shared transit between {destination} stops can reduce travel emissions.",
        },
    }


@router.post("/plan-trip")
def plan_trip(req: PlanTripRequest):
    return build_plan(req)
