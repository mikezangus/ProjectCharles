import json


def write_json(path: str, dict: dict[int, list[int]] | dict[int, list[int]]):
    with open(path, "w") as file:
        json.dump(dict, file, indent=4)
    print(f"Saved to {path}")
