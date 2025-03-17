import nltk
import os
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from file_manager import FileManager


CURRENT_DIR = os.path.abspath(os.path.dirname(__file__))
PROJECT_DIR = os.path.dirname(os.path.dirname(CURRENT_DIR))
BILL_TEXTS_DIR = os.path.join(PROJECT_DIR, "data", "bill-texts")
SOURCE_BILL_TEXTS_DIR = os.path.join(BILL_TEXTS_DIR, "source")
TOKENS_DIR = os.path.join(BILL_TEXTS_DIR, "tokens")


nltk.download("stopwords")
nltk.download("punkt")
    

def tokenize_file(text: str) -> list[str]:
    text = text.lower()
    tokens = word_tokenize(text)
    tokens = [word for word in tokens if word.isalnum()]
    tokens = [word for word in tokens if word not in stopwords.words("english")]
    return tokens


def tokenize_files():
    file_manager = FileManager()
    source_file_names = file_manager.get_file_names(SOURCE_BILL_TEXTS_DIR, extension=".txt")
    source_file_len = len(source_file_names)
    for i, file_name in enumerate(source_file_names, start=1):
        print(f"[{i}/{source_file_len}] {file_name}")
        source_path = os.path.join(SOURCE_BILL_TEXTS_DIR, file_name)
        text = file_manager.load_txt_file(source_path)
        tokens = tokenize_file(text)
        tokens_path = os.path.join(TOKENS_DIR, file_name)
        file_manager.save_tokens_to_file(tokens_path, tokens)


if __name__ == "__main__":
    tokenize_files()
