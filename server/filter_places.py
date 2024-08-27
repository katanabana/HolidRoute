from g4f.client import Client


def get_places_ids(places, user_description):
    context = ''
    for place in places:
        if 'name' not in place or 'categories' not in place:
            continue
        id = place['id']
        name = place['name']
        place_categories = place['categories']
        associated_words_list = []
        for category in place_categories:
            associated_words_list.append(category)
        associated_words = ', '.join(associated_words_list)
        place_description = f'{id}. `{name}` - {associated_words}\n'
        context += place_description
    question = f'I have the following requirements for the route `{user_description}`\n'
    question += 'Depending on the information about places, what route should I follow?\n'
    question += 'Return list of ids of the places I should visit separated with commas, without any other text.'

    content = context + question

    client = Client()
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": content}],
    )
    ids_s = response.choices[0].message.content
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
    return ids_list
