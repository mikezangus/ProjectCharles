import json
import mysql.connector
import os
from mysql.connector.connection import MySQLConnection
from mysql.connector.cursor import MySQLCursor
from schema import Record
from typing import Any, Dict, List


MEMBERS_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.dirname(MEMBERS_DIR)
PROJECT_DIR = os.path.dirname(DATA_DIR)
CONFIG_PATH = os.path.join(PROJECT_DIR, "config.json")
TABLE_NAME = "Members"


def get_config() -> Dict[str, str]:
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)
    

def connect_to_db(config: Dict[str, Any]) -> MySQLConnection:
    return mysql.connector.connect(
        host=config["SQL_HOST_NAME"],
        user=config["SQL_USER_NAME"],
        password=config["SQL_PASSWORD"],
        database="DB"
    )


def create_table(cursor: MySQLCursor) -> None:
    create_table = f"""
    CREATE TABLE IF NOT EXISTS {TABLE_NAME} (
        bio_id VARCHAR(7),
        congress INT,
        chamber CHAR(1),
        state CHAR(2),
        last_name VARCHAR(25),
        first_name VARCHAR(20),
        party CHAR(1),
        PRIMARY KEY (bio_id, congress, chamber, state)
    );
    """
    cursor.execute(create_table)


def insert_records(records: List[Record],
                   cursor: MySQLCursor,
                   db: MySQLConnection) -> None:
    insert = f"""
    INSERT IGNORE INTO {TABLE_NAME}
    (bio_id, congress, chamber, state, last_name, first_name, party)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    values = [
        (
            record.bio_id,
            record.congress,
            record.chamber,
            record.state,
            record.last_name,
            record.first_name,
            record.party
        )
        for record in records
    ]
    cursor.executemany(insert, values)
    db.commit()


def main(records: List[Record]) -> None:
    try:
        db = connect_to_db(get_config())
        cursor = db.cursor()
        create_table(cursor)
        print("Started inserting")
        insert_records(records, cursor, db)
        print("Finished inserting")
    except Exception as e:
        print(f"\n{__file__}\nError | {e}")
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()
