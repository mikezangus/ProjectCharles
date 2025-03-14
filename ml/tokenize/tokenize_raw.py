import nltk
import os
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from file_manager import FileManager


CURRENT_DIR = os.path.abspath(os.path.dirname(__file__))
PROJECT_DIR = os.path.dirname(os.path.dirname(CURRENT_DIR))
BILL_TEXTS_DIR = os.path.join(PROJECT_DIR, "data", "data", "bill-texts")
SOURCE_BILL_TEXTS_DIR = os.path.join(BILL_TEXTS_DIR, "source")
TOKENIZED_DIR = os.path.join(BILL_TEXTS_DIR, "tokenized_raw")


nltk.download("stopwords")
nltk.download("punkt")
    

def tokenize_text(text: str) -> list[str]:
    text = text.lower()
    tokens = word_tokenize(text)
    tokens = [word for word in tokens if word.isalnum()]
    tokens = [word for word in tokens if word not in stopwords.words("english")]
    return tokens


def tokenize_raw():
    file_manager = FileManager()
    source_file_names = file_manager.get_file_names(SOURCE_BILL_TEXTS_DIR, ".txt")
    source_file_count = len(source_file_names)
    for i, file_name in enumerate(source_file_names, start=1):
        print(f"[{i}/{source_file_count}] {file_name}")
        source_path = os.path.join(SOURCE_BILL_TEXTS_DIR, file_name)
        text = file_manager.load_txt_file(source_path)
        tokens = tokenize_text(text)
        tokens_path = os.path.join(TOKENIZED_DIR, file_name)
        file_manager.save_tokenized_file(tokens_path, tokens)


if __name__ == "__main__":
    tokenize_raw()
