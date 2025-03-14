import os
from write_json import write_json


START_YEAR = 1789
END_YEAR = START_YEAR + 1000
START_CONGRESS = 1
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
FILE_PATH = os.path.join(CURRENT_DIR,  "years-congresses.json")


def generate() -> dict[int, list[int]]:
    years_congresses = {}
    year = START_YEAR
    congress = START_CONGRESS
    for year in range(START_YEAR, END_YEAR + 1):
        if year % 2 == 1 and year > START_YEAR: congress += 1
        years_congresses[year] = congress
    return years_congresses


if __name__ == "__main__":
    years_congresses = generate()
    write_json(FILE_PATH, years_congresses)
