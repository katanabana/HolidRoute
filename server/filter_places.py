import json
import httpx
import urllib.parse

async def get_places_ids(places, user_description):
    context = json.dumps(places, ensure_ascii=False)
    question = f'Requirements for the route are the following text: `{user_description}`\n'
    question += 'Determine in what language the requirements for the route are written.\n'
    question += 'Depending on the data about the places and info on the Internet, what route should I follow '
    question += 'to fit route requirements?\n'
    question += "If the route requirements don't say to go to multiple places, return a list of length 1.\n"
    question += "The output json dictionaries should include brief descriptions of the places to visit in the language "
    question += "of the route requirements. "
    question += "Each description should include the reason why you think the place fits the route requirements.\n"
    question += 'Return only a json list consisting of dictionaries in the following format:\n'
    question += '`[{"id": id, "name": name, "description": brief_description_of_the_place}, ...]`'

    prompt = 'I have the following data about places:\n```\nplaces = ' + context + '```\n' + question
    prompt = urllib.parse.quote(prompt)

    async with httpx.AsyncClient() as client:
        response = await client.post(
            'https://gemini-fastapi-hyb0.onrender.com/generate',
            json={"prompt": prompt}
        )

        if response.status_code != 200:
            raise RuntimeError(f"Request failed with status code {response.status_code}: {response.text}")

        if not response.content:
            raise RuntimeError("Empty response received from the API.")

        print(response.content)
        answer = response.json()
        answer = answer['response']
        answer = answer[answer.find('['):]
        answer = answer[:answer.rfind(']') + 1]
        filtered_places = json.loads(answer)
        print(filtered_places)
        return filtered_places
