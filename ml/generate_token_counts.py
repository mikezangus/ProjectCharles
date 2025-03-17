import os
from file_manager import FileManager


CURRENT_DIR = os.path.abspath(os.path.dirname(__file__))
PROJECT_DIR = os.path.dirname(os.path.dirname(CURRENT_DIR))
BILL_TEXTS_DIR = os.path.join(PROJECT_DIR, "data", "bill-texts")
TOKENS_DIR = os.path.join(BILL_TEXTS_DIR, "tokens")
TOKEN_COUNTS_DIR = os.path.join(BILL_TEXTS_DIR, "token-counts")


def get_bill_types(file_manager: FileManager) -> list:
    bill_types = []
    file_names = file_manager.get_file_names(TOKENS_DIR, extension=".txt")
    for file_name in file_names:
        bill_type = file_name.split('_')[1]
        if bill_type not in bill_types:
            bill_types.append(bill_type)
    return bill_types


def generate_token_counts() -> None:
    file_manager = FileManager()
    bill_types = get_bill_types(file_manager)
    for bill_type in bill_types:
        token_counts = {}
        file_names = file_manager.get_file_names(TOKENS_DIR, bill_type, ".txt")
        for file_name in file_names:
            file_path = os.path.join(TOKENS_DIR, file_name)
            all_tokens = file_manager.load_tokens_from_file(file_path)
            unique_tokens = list(set(all_tokens))
            for token in unique_tokens:
                token_counts[token] = token_counts.get(token, 0) + 1
        token_counts = dict(sorted(
            token_counts.items(),
            key=lambda x: x[1],
            reverse=True
        ))
        save_path = os.path.join(TOKEN_COUNTS_DIR, f"{bill_type}.json")
        file_manager.save_dict_to_file(save_path, token_counts)


if __name__ == "__main__":
    generate_token_counts()
