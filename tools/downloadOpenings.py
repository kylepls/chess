from bs4 import BeautifulSoup
import requests
import json
import re

headers = {
    "User-Agent": "Mozilla/5.0 (Linux; U; Android 4.2.2; he-il; NEO-X5-116A Build/JDQ39) AppleWebKit/534.30 (KHTML, "
                  "like Gecko) Version/4.0 Safari/534.30"
}


def get_line(c):
    name_with_eco = c.select_one('.opname > a').text.strip()
    eco = re.search(r"([A-Z]\d{2}(:?-[A-Z]\d{2})?)\s.*", name_with_eco).group(1)
    name_without_eco = re.sub(r"([A-Z]\d{2}(:?-[A-Z]\d{2})?)\s*", "", name_with_eco)
    moves = c.select_one('.opmoves').text.strip()
    return {
        'name': name_without_eco,
        'eco': eco,
        'moves': moves
    }


response = requests.get('https://www.365chess.com/eco.php', headers=headers)
webpage = response.content

soup = BeautifulSoup(webpage, "html.parser")

tree = soup.find(id='ecotree')

find = tree.select('.line')
openings = [get_line(c) for c in find]
print(json.dumps(openings))

with open("../src/practice/pgn/openings.pgn", "w") as file:
    for opening in openings:
        file.write("""[Opening "{}"]\n""".format(opening['name']))
        file.write("\n")
        file.write("{}\n".format(opening['moves']))
        file.write("*\n\n")
