import json
import os


JSON_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 
                         "output.json")


def find_field_lengths(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        data = json.load(file)
    max_lengths = {}
    for record in data:
        for key, value in record.items():
            value_length = len(str(value))
            if key not in max_lengths:
                max_lengths[key] = value_length
            else:
                max_lengths[key] = max(max_lengths[key], value_length)
    return max_lengths


def main():
    if not os.path.exists(JSON_FILE):
        print(f"Error: File {JSON_FILE} not found")
        return
    lengths = find_field_lengths(JSON_FILE)
    print("\nMax Field Lengths:")
    for field, length in lengths.items():
        print(f"{field}: {length}")


if __name__ == "__main__":
    main()
