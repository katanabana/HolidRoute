import requests
from concurrent.futures import ThreadPoolExecutor
from filter_places import get_places_ids

API_KEY = 'd548c5ed24604be6a9dd0d989631f783'

CATEGORIES = ['activity', 'airport', 'beach', 'camping', 'catering', 'entertainment', 'healthcare', 'leisure',
              'low_emission_zone', 'man_made', 'national_park', 'natural', 'pet', 'political', 'power', 'production',
              'railway', 'religion', 'ski', 'sport', 'tourism']


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
                'categories': lambda: list(set([en.split('.')[0] for en in item['properties']['categories']]))
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


def get_places(lon, lat, user_description):
    params_list = []
    n = 1
    for i in range(0, len(CATEGORIES), n):
        params = dict(
            categories=','.join(list(CATEGORIES)[i:i + n]),
            filter=f'circle:{lon},{lat},50000',
            limit=n * 10 if user_description else n * 1,
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
    if user_description:
        proper_ids = get_places_ids(places, user_description)
        proper_places = []
        for place in places:
            if place['id'] in proper_ids:
                proper_places.append(place)
    else:
        proper_places = places
    return proper_places
