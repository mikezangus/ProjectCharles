from db import DB
from file_manager import FileManager

import os


TABLE_NAME = "Bills"
CURRENT_DIR = os.path.abspath(os.path.dirname(__file__))
PROJECT_DIR = os.path.dirname(CURRENT_DIR)
BILLS_DIR = os.path.join(PROJECT_DIR, "data", "bill-texts", "source")


def insert_1(bill_id: str):
    return bill_id[:3] + '_' + bill_id[3:]


def insert_2(bill_id: str):
    i = 4
    while i < len(bill_id):
        if bill_id[i].isdigit():
            break
        i += 1
    return bill_id[:i] + '_' + bill_id[i:]
    

def main():
    db = DB()
    query = db.query(f"SELECT bill_id FROM {TABLE_NAME}")
    length = len(query)
    for i, row in enumerate(query, start = 1):
        print('[', i, '/', length, ']')
        current_bill_id = row["bill_id"]
        new_bill_id = insert_1(current_bill_id)
        new_bill_id = insert_2(new_bill_id)
        db.execute(
            f"""
                UPDATE {TABLE_NAME}
                SET bill_id = %s WHERE bill_id = %s;
            """,
            (new_bill_id, current_bill_id)
        )

def main2():
    file_manager = FileManager()
    files = file_manager.get_file_names_by_len(BILLS_DIR)
    for file in files:
        print(file)



if __name__ == "__main__":
    main2()
