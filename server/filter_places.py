import json

from g4f.client import Client


def get_places_ids(places, user_description):
    context = json.dumps(places, ensure_ascii=False)
    question = f'Requirements for the route: `{user_description}`\n'
    question += 'Depending on the data about the places and info on the Internet, what route should I follow '
    question += 'to fit route requirements?\n'
    question += "If the route requirements don't say to go to multiple places, return a list of length 1.\n"
    question += "The output json dictionaries should include brief descriptions of the places to visit in the language "
    question += "of the route requirements, not the language of the region where the places are located. "
    question += "Each description should include the reason why you think the place fits the route requirements.\n"
    question += 'Return only a json list consisting of dictionaries in the following format:\n'
    question += '`[{"id": id, "name": name, "description": brief_description_of_the_place}, ...]`'

    content = 'I have the following data about places:\n```\nplaces = ' + context + '```\n' + question
    client = Client()
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": content}],
    )
    answer = response.choices[0].message.content
    answer = answer[answer.find('['):]
    answer = answer[:answer.rfind(']') + 1]
    return json.loads(answer)
