import json

from g4f.client import Client


def get_places_ids(places, user_description):
    context = json.dumps(places, ensure_ascii=False)
    question = f'And requirements for the route: `{user_description}`\n'
    question += 'Depending on the data about the places and info on the Internet, what route should I follow?\n'
    question += "If the route requirements don't say to go to multiple places, return a list of length 1"
    question += 'Return json list consisting of dictionaries in the following format:\n'
    description = 'brief_description_of_the_place_in_the_language_of_the_route_requirements_' \
                  'including_what_I_can_do_there'
    question += '`[{"id": id, "name": name, "description": ' + description + '}, ...]`'

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
