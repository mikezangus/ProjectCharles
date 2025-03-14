import json


def main(members, file_path):
    with open(file_path, "w") as f:
        json.dump([{slot: getattr(member, slot) for slot in member.__slots__} for member in members], f, indent=2)
