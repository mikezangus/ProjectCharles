import json
import os
from typing import Dict, List


START_YEAR = 1789
END_YEAR = 2789
START_CONGRESS = 1
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
FILE_PATH = os.path.join(CURRENT_DIR,  "years-congresses.json")


def generate() -> Dict[int, List[int]]:
    dict = {}
    year = START_YEAR
    congress = START_CONGRESS
    for year in range(START_YEAR, END_YEAR + 1):
        if year % 2 == 1 and year > START_YEAR: congress += 1
        dict[year] = congress
    return dict


def save(dict: Dict[int, List[int]]) -> None:
    with open(FILE_PATH, "w") as f:
        json.dump(dict, f, indent=4)
    print(f"Saved to {FILE_PATH}")


if __name__ == "__main__":
    save(generate())
