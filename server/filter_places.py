import json

from g4f.client import Client
import os
import subprocess

CHROME_PATH = None


def install_chrome():
    """Installs Chrome via apt-get if it's not installed."""
    print("Installing Google Chrome...")

    # Update package list and install Chrome dependencies
    subprocess.run(['apt-get', 'update'], check=True)
    subprocess.run(['apt-get', 'install', '-y', 'wget', 'gnupg', 'unzip'], check=True)

    # Add Google Chrome's GPG key and repository
    subprocess.run(['wget', '-q', '-O', '-', 'https://dl.google.com/linux/linux_signing_key.pub'], check=True)
    subprocess.run(['apt-key', 'add', '-'], check=True)
    subprocess.run(['sh', '-c',
                    'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> '
                    '/etc/apt/sources.list.d/google-chrome.list'],
                   check=True)

    # Install Google Chrome
    subprocess.run(['apt-get', 'update'], check=True)
    subprocess.run(['apt-get', 'install', '-y', 'google-chrome-stable'], check=True)


def test_g4f():
    """Attempts to create a g4f client, installing Chrome if necessary."""
    try:
        # First, try to create the client without specifying a browser path
        client = Client()
        response = client.chat.completions.create(prompt="Say something cool")
        print(response)
    except FileNotFoundError:
        print("Chrome not found. Installing Chrome...")

        # If Chrome is not installed, install it
        install_chrome()

        # Re-initialize the client with the correct browser path after installation
        global CHROME_PATH
        CHROME_PATH = '/usr/bin/google-chrome'
        client = Client(browser_executable_path=CHROME_PATH)
        response = client.chat.completions.create(prompt="Say something cool")
        print(response)


test_g4f()


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
    if CHROME_PATH is None:
        client = Client()
    else:
        client = Client(browser_executable_path=CHROME_PATH)
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": content}],
    )
    answer = response.choices[0].message.content
    answer = answer[answer.find('['):]
    answer = answer[:answer.rfind(']') + 1]
    return json.loads(answer)
