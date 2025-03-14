import glob
import json
import os
from schema import Record
from typing import Any


CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BIO_DIR = os.path.join(CURRENT_DIR, "BioguideProfiles")
DATA_DIR = os.path.dirname(CURRENT_DIR)

PARTIES_PATH = os.path.join(DATA_DIR, "parties.json")
STATES_PATH = os.path.join(DATA_DIR, "states.json")


def parse_file(file: dict[str, Any],
               states: list,
               parties: dict[str, str]) -> list[Record]:
    file_records = []
    data = file.get("data", file)
    bio_id = data.get("usCongressBioId")
    last_name = data.get("familyName")
    first_name = data.get("givenName")
    for job in data.get("jobPositions", []):
        affiliation = job.get("congressAffiliation", {})
        state = affiliation \
            .get("represents", {}) \
            .get("regionCode")
        if state not in states:
            continue
        congress = affiliation \
            .get("congress", {}) \
            .get("congressNumber")
        if congress is None or int(congress) < 102:
            continue
        chamber = (
            "H" if job \
                .get("job", {}) \
                .get("name") == "Representative"
            else "S" if job \
                .get("job", {}) \
                .get("name") == "Senator"
            else None
        )
        party = affiliation \
            .get("partyAffiliation", [{}])[0] \
            .get("party", {}) \
            .get("name")
        party = parties[party]
        if None in (
            bio_id,
            congress,
            chamber,
            state,
            last_name,
            first_name,
            party,
        ):
            continue
        record = Record(
            bio_id=bio_id,
            congress=congress,
            chamber=chamber,
            state=state,
            last_name=last_name,
            first_name=first_name,
            party=party
        )
        file_records.append(record)
    return file_records
    

def main() -> list[Record]:
    with open (STATES_PATH, "r") as s:
        states = json.load(s)
    with open (PARTIES_PATH, "r") as p:
        parties = json.load(p)
    members = []
    for path in glob.glob(os.path.join(BIO_DIR, "*.json")):
        try:
            with open(path, "r", encoding="utf-8") as file:
                members.extend(parse_file(json.load(file), states, parties))
        except json.JSONDecodeError as e:
            print(f"\n{__file__}\nError | {e}")
    return members


if __name__ == "__main__":
    main()
