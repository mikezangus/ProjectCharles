import os
import insert_members_into_db as insert_members_into_db
import parse_member_files as parse_member_files
import save_members_to_file as save_members_to_file


OUTPUT_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), 
    "output.json"
)


def main():
    members = parse_member_files.main()
    insert_members_into_db.main(members)
    save_members_to_file.main(members, OUTPUT_PATH)


if __name__ == "__main__":
    main()
