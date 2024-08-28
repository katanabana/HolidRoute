import json

from g4f.client import Client


def get_places_ids(places, user_description):
    context = json.dumps(places, ensure_ascii=False)
    question = f'And requirements for the route: `{user_description}`\n'
    question += 'Depending on the data about the places and info on the Internet, what route should I follow?\n'
    question += "If the route description doesn't require to go to multiple places, return a list of length 1"
    question += 'Return json list consisting of dictionaries with 2 keys (id, name) in the following format:\n'
    question += '[{"id": id, "name": name_and_brief_description_of_the_place}, ...]'

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