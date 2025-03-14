import os
from write_json import write_json


START_CONGRESS = 1
END_CONGRESS = START_CONGRESS + 500
START_YEAR = 1789
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
FILE_PATH = os.path.join(CURRENT_DIR,  "congresses-years.json")


def generate() -> dict[int, list[int]]:
    congresses_years = {}
    congress = START_CONGRESS
    year = START_YEAR
    for congress in range(START_CONGRESS, END_CONGRESS + 1):
        congresses_years[congress] = [year, year + 1]
        year += 2
    return congresses_years


if __name__ == "__main__":
    congresses_years = generate()
    write_json(FILE_PATH, congresses_years)
