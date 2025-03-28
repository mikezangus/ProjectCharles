import json
import os


class FileManager:

    @staticmethod
    def get_file_names(dir: str, includes: str = None, extension: str = None) -> list[str]:
        if not os.path.exists(dir):
            raise FileNotFoundError(f"Dir not found: {dir}")
        file_names = os.listdir(dir)
        if includes:
            file_names = [f for f in file_names if includes.lower() in f.lower()]
        if extension:
            file_names = [f for f in file_names if f.endswith(extension)]
        return sorted(file_names)
    
    @staticmethod
    def load_tokens_from_file(path: str) -> list[str]:
        if not os.path.isfile(path):
            raise FileNotFoundError(f"File not found at path:{path}")
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
    def load_json_file(path: str) -> dict:
        if not os.path.isfile(path):
            raise FileNotFoundError(f"File not found at path: {path}")
        if not path.endswith(".json"):
            raise ValueError(f"File path is not to .json file: {path}")
        with open(path, 'r', encoding="utf-8") as file:
            return json.load(file)
    
    @staticmethod
    def save_dict_to_file(path: str, content: dict):
        if not path.endswith(".json"):
            raise ValueError(f"File path is not to .json file: {path}")
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'w', encoding="utf=8") as file:
            json.dump(content, file, indent=4)

    @staticmethod
    def save_tokens_to_file(path: str, content: list[str]):
        if not path.endswith(".txt"):
            raise ValueError(f"File path is not to .txt file: {path}")
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w", encoding="utf-8") as file:
            file.write(" ".join(content))

    @staticmethod
    def get_file_names_by_len(dir: str, descending = True) -> list:
        if not os.path.exists(dir):
            raise FileNotFoundError(f"Dir not found: {dir}")
        file_names = os.listdir(dir)
        sorted_file_names = sorted(file_names, key=len, reverse=descending)
        return sorted_file_names
