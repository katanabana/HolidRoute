import json
import asyncio
import sys
import time

from g4f import Provider
from g4f.client import AsyncClient

if sys.platform == "win32":
    from asyncio import WindowsSelectorEventLoopPolicy

    asyncio.set_event_loop_policy(WindowsSelectorEventLoopPolicy())

PROVIDERS_TO_MODELS = {
    None: 'gpt-4o',
    Provider.OpenaiChat: 'gpt-4o',
    Provider.Liaobots: 'gpt-4o',
    Provider.Bing: 'gpt-4o',
    Provider.Chatgpt4o: 'gpt-4o',
    Provider.Theb: 'gpt-4o',
    Provider.You: 'gpt-4o',
    Provider.HuggingChat: 'command-r+',
    Provider.Llama: 'llama-3-70b',
    Provider.DeepInfra: 'llama-3-70b',
    Provider.Reka: 'reka-core',
}

TIMEOUT_SECONDS = 30  # Set timeout for test requests


async def get_test_response_info(provider, semaphore):
    async with semaphore:
        try:
            start_time = time.time()
            response = await asyncio.wait_for(
                get_g4f_response('say "test"', provider, PROVIDERS_TO_MODELS[provider]),
                timeout=TIMEOUT_SECONDS
            )
            success = True
        except asyncio.TimeoutError:
            response = 'Request timed out'
            success = False
        except Exception as ex:
            response = str(ex)
            success = False

        response_time = time.time() - start_time
        return provider, PROVIDERS_TO_MODELS[provider], response_time, response, success


async def get_best_provider():
    print('\nSearching for the best provider...')
    semaphore = asyncio.Semaphore(2)  # Limit concurrent tasks
    tasks = [get_test_response_info(provider, semaphore) for provider in PROVIDERS_TO_MODELS]

    # Process results concurrently, but with limited concurrency
    results = await asyncio.gather(*tasks)

    best_provider = False
    fastest_time = float('inf')

    for result in results:
        provider, model, response_time, response, success = result

        print(f'''
        Provider: {provider.__name__ if hasattr(provider, '__name__') else provider}
        Model: {model}
        Response time: {response_time:.2f}s
        Response: {response}
        Success: {success}
        ''')

        if success and response_time < fastest_time:
            fastest_time = response_time
            best_provider = provider

    if best_provider:
        name = best_provider.__name__ if hasattr(best_provider, "__name__") else best_provider
        print(f'Best provider: {name}, Model: {PROVIDERS_TO_MODELS[best_provider]}\n')
        return best_provider
    else:
        print('No provider succeeded.')
        return


async def get_g4f_response(prompt, provider, model):
    client = AsyncClient(provider=provider)
    messages = [{"role": "user", "content": prompt}]
    response = await client.chat.completions.create(model=model, messages=messages)
    return response.choices[0].message.content


# Run the provider selection
BEST_PROVIDER = asyncio.run(get_best_provider())


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

    answer = await get_g4f_response(prompt, BEST_PROVIDER, PROVIDERS_TO_MODELS[BEST_PROVIDER])
    answer = answer[answer.find('['):]
    answer = answer[:answer.rfind(']') + 1]
    return json.loads(answer)
