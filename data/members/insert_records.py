import json
import os
import mysql.connector
from mysql.connector.connection import MySQLConnection
from mysql.connector.cursor import MySQLCursor
from typing import Any, Dict, List
from schema import Record


CONFIG_PATH: str = os.path.join(
    os.path.dirname(
        os.path.dirname(
            os.path.dirname(
                os.path.abspath(
                    __file__)))),
    "config.json"
)
TABLE_NAME: str = "Members"


def get_config() -> Dict[str, Any]:
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
        last_name VARCHAR(25),
        first_name VARCHAR(20),
        state CHAR(2),
        party VARCHAR(35),
        congress INT,
        chamber CHAR(1),
        PRIMARY KEY (bio_id, congress, chamber)
    );
    """
    cursor.execute(create_table)


def insert_records(records: List[Record],
                   cursor: MySQLCursor,
                   db: MySQLConnection) -> None:
    insert = f"""
    INSERT IGNORE INTO {TABLE_NAME}
    (bio_id, last_name, first_name, state, party, congress, chamber)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    values = [
        (
            record.bio_id,
            record.last_name,
            record.first_name,
            record.state,
            record.party,
            record.congress,
            record.chamber
        )
        for record in records
    ]
    cursor.executemany(insert, values)
    db.commit()


def main(records: List[Record]) -> None:
    try:
        config = get_config()
        db = connect_to_db(config)
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
