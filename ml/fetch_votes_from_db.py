import os
from db import DB


CURRENT_DIR = os.path.abspath(os.path.dirname(__file__))
PROJECT_DIR = os.path.dirname(CURRENT_DIR)
CONFIG_PATH = os.path.join(PROJECT_DIR, "config.json")


def fetch_votes_from_db(bio_id: str):
    db = DB(CONFIG_PATH)
    query = "SELECT * FROM Votes WHERE bio_id = %s"
    param = (bio_id,)
    votes = db.query(query, param)
    return votes
