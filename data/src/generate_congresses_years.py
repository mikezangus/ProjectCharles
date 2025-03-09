import json
import os
from typing import Dict, List


START_CONGRESS = 1
END_CONGRESS = 501
START_YEAR = 1789
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
FILE_PATH = os.path.join(CURRENT_DIR,  "congresses-years.json")


def generate() -> Dict[int, List[int]]:
    dict = {}
    congress = START_CONGRESS
    year = START_YEAR
    for congress in range(START_CONGRESS, END_CONGRESS + 1):
        dict[congress] = [year, year + 1]
        year += 2
    return dict


def save(dict: Dict[int, List[int]]) -> None:
    with open(FILE_PATH, "w") as f:
        json.dump(dict, f, indent=4)
    print(f"Saved to {FILE_PATH}")


if __name__ == "__main__":
    save(generate())
