import json
import os


FILE_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), 
    "output.json"
)


def get_maxlens():
    with open(FILE_PATH, "r", encoding="utf-8") as file:
        data = json.load(file)
    lens = {}
    for record in data:
        for key, value in record.items():
            value_length = len(str(value))
            if key not in lens:
                lens[key] = value_length
            else:
                lens[key] = max(lens[key], value_length)
    return lens


def get_minlens():
    with open(FILE_PATH, "r", encoding="utf-8") as file:
        data = json.load(file)
    lens = {}
    for record in data:
        for key, value in record.items():
            value_length = len(str(value))
            if key not in lens:
                lens[key] = value_length
            else:
                lens[key] = min(lens[key], value_length)
    return lens


def main():
    if not os.path.exists(FILE_PATH):
        print(f"Error: File {FILE_PATH} not found")
        return
    maxlens = get_maxlens()
    minlens = get_minlens()
    print("\nMax Field Lengths:")
    for field, len in maxlens.items():
        print(f"{field}: {len}")
    print("\nMin Field Lengths:")
    for field, len in minlens.items():
        print(f"{field}: {len}")


if __name__ == "__main__":
    main()
