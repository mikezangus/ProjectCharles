import glob
import json
import os
from schema import Record
from typing import Any


BIO_DIR = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "BioguideProfiles"
)


def parse_file(file: dict[str, Any]) -> list[Record]:
    file_records = []
    data = file.get("data", file)
    bio_id = data.get("usCongressBioId")
    last_name = data.get("familyName")
    first_name = data.get("givenName")
    for job in data.get("jobPositions", []):
        a = job.get("congressAffiliation", {})
        state = a.get("represents", {}).get("regionCode")
        party = a.get("partyAffiliation", [{}])[0].get("party", {}).get("name")
        congress = a.get("congress", {}).get("congressNumber")
        chamber = (
            "H" if job.get("job", {}).get("name") == "Representative"
            else "S" if job.get("job", {}).get("name") == "Senator"
            else None
        )
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
    records = []
    for path in glob.glob(os.path.join(BIO_DIR, "*.json")):
        try:
            with open(path, "r", encoding="utf-8") as file:
                records.extend(parse_file(json.load(file)))
        except json.JSONDecodeError as e:
            print(f"\n{__file__}\nError | {e}")
    return records


if __name__ == "__main__":
    main()
