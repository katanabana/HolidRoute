import requests

API_KEY = 'd548c5ed24604be6a9dd0d989631f783'


def get_place_id(name):
    url = 'https://api.geoapify.com/v1/geocode/search'
    params = {
        "text": name,
        "apiKey": API_KEY,
    }
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()  # Raise an exception for non-2xx status codes
        data = response.json()
        return data["features"][0]["properties"]["place_id"]
    except Exception as e:
        print(f"An error occurred: {e}")
        return None


def get_attractions(place_name, n=5, categories=('tourism',)):
    url = "https://api.geoapify.com/v2/places"
    params = dict(
        categories=','.join(categories),
        filter=f'place:{get_place_id(place_name)}',
        limit=n,
        apiKey=API_KEY
    )
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()  # Raise an exception for non-2xx status codes
        data = response.json()['features']
        places = []
        for item in data:
            place = {
                'working_hours': '',
                'coordinates': item['geometry']['coordinates']
            }
            places.append(place)
    except Exception as e:
        print(f"An error occurred: {e}")
        return None


from pprint import pprint

pprint(get_attractions('Yekaterinburg'))
