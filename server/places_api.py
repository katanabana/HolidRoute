from pprint import pprint
import requests
from concurrent.futures import ThreadPoolExecutor

API_KEY = 'd548c5ed24604be6a9dd0d989631f783'
CATEGORIES = ['activity', 'airport', 'beach', 'camping', 'catering', 'education', 'entertainment', 'healthcare', 'leisure', 'low_emission_zone', 'man_made',
              'national_park', 'natural', 'office', 'parking', 'pet', 'political', 'populated_place', 'power', 'production', 'religion', 'rental', 'service', 'ski', 'sport', 'tourism']


def get_places_by_params(params):
    places = []
    url = "https://api.geoapify.com/v2/places"
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()  # Raise an exception for non-2xx status codes
        data = response.json()['features']

        for item in data:
            keys_to_getters = {
                'name': lambda: item['properties']['name'],
                'coordinates': lambda: item['geometry']['coordinates'][::-1],
                'categories': lambda: item['properties']['categories']
            }
            place = {}
            for (key, get_value) in keys_to_getters.items():
                try:
                    place[key] = get_value()
                except:
                    pass
            if place:
                places.append(place)
    except Exception as e:
        print(f"An error occurred: {e}")
    return places


def get_places(lon, lat):
    params_list = []
    n = 9
    for i in range(0, len(CATEGORIES), n):
        params = dict(
            categories=CATEGORIES[i:i+n],
            filter=f'circle:{lon},{lat},50000',
            limit=n * 3,
            apiKey=API_KEY,
            bias=f'proximity:{lon},{lat}'
        )
        params_list.append(params)

    places = []
    with ThreadPoolExecutor(max_workers=50) as pool:
        groups_of_places = list(pool.map(get_places_by_params, params_list))
        for group in groups_of_places:
            for place in group:
                if place not in places:
                    places.append(place)
    for i, place in enumerate(places):
        place['id'] = i
    return places
