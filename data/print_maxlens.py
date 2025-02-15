import json
import os


OUTPUT_FILE_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), 
    "output.json"
)


def get_maxlens(file_path):
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
    if not os.path.exists(OUTPUT_FILE_PATH):
        print(f"Error: File {OUTPUT_FILE_PATH} not found")
        return
    lengths = get_maxlens(OUTPUT_FILE_PATH)
    print("\nMax Field Lengths:")
    for field, length in lengths.items():
        print(f"{field}: {length}")


if __name__ == "__main__":
    main()
