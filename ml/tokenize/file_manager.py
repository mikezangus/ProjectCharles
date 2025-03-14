import os


class FileManager:

    @staticmethod
    def get_file_names(dir: str, extension: str = None) -> list[str]:
        if not os.path.exists(dir):
            raise FileNotFoundError(f"Dir not found: {dir}")
        file_names = os.listdir(dir)
        if extension:
            file_names = [f for f in file_names if f.endswith(extension)]
        return sorted(file_names)
    
    @staticmethod
    def load_tokens_from_txt_file(path: str) -> list[str]:
        if not os.path.isfile(path):
            raise FileNotFoundError(f"File not found at path: {path}")
        if not path.endswith(".txt"):
            raise ValueError(f"File path is not to .txt file: {path}")
        with open(path, "r", encoding="utf-8") as file:
            return file.read().split()

    @staticmethod
    def load_txt_file(path: str) -> str:
        if not os.path.isfile(path):
            raise FileNotFoundError(f"File not found at path: {path}")
        if not path.endswith(".txt"):
            raise ValueError(f"File path is not to .txt file: {path}")
        with open(path, "r", encoding="utf-8") as file:
            return file.read()
    
    @staticmethod
    def save_tokenized_file(path: str, tokens: list[str]):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w", encoding="utf-8") as file:
            file.write(" ".join(tokens))
