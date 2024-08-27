import json

from g4f.client import Client


def get_places_ids(places, user_description):
    context = json.dumps(places, ensure_ascii=False)
    question = f'And requirements for the route: `{user_description}`\n'
    question += 'Depending on the information about the places, what route should I follow?\n'
    question += 'Return list of ids of the places I should visit separated with commas, without any other text.'

    content = 'I have the following info about places:\n```\nplaces = ' + context + '```\n' + question

    print(content)
    client = Client()
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": content}],
    )
    ids_s = response.choices[0].message.content
    print(ids_s)
    if ', ' in ids_s:
        ids_list = ids_s.split(', ')
    else:
        ids_list = ids_s.split(',')
    try:
        ids_list = list(map(int, ids_list))
    except Exception:
        ids_list = []
        for i in range(100, 0):
            if str(i) in ids_s:
                ids_list.append(i)
                ids_s = ids_s.replace(str(i), '')
    if not ids_list:
        for place in places:
            if place['name'] in ids_s:
                ids_list.append(place['id'])
    return ids_list
