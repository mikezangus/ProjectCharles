import json
import mysql.connector
import os
from mysql.connector.connection import MySQLConnection


class DB:

    current_dir = os.path.abspath(os.path.dirname(__file__))
    config_path = os.path.join(current_dir, "config.json")

    def __init__(self):
        self.config = self._load_config()
        self.connection: MySQLConnection = None

    def _load_config(self) -> dict[str, str]:
        with open(self.config_path, 'r') as config_file:
            return json.load(config_file)
    
    def _connect(self) -> None:
        if self.connection is None or not self.connection.is_connected():
            try:
                self.connection = mysql.connector.connect(
                    host=self.config["SQL_HOST_NAME"],
                    user=self.config["SQL_USER_NAME"],
                    password=self.config["SQL_PASSWORD"],
                    database=self.config["SQL_DB_NAME"]
                )
            except mysql.connector.Error as e:
                print("Error connecting to DB:\n", e)
                self.connection = None
    
    def query(self, query: str, params: tuple = None) -> list[dict]:
        self._connect()
        try:
            with self.connection.cursor(dictionary=True) as cursor:
                cursor.execute(query, params or ())
                return cursor.fetchall()
        except mysql.connector.Error as e:
            print("Query error:\n", e)
            return []
    
    def execute(self, query: str, params: tuple | list = None) -> None:
        self._connect()
        try:
            with self.connection.cursor() as cursor:
                cursor.execute(query, params or ())
                self.connection.commit()
        except mysql.connector.Error as e:
            print("Execution error:\n", e)
            self.connection.rollback()

    def close(self) -> None:
        if self.connection and self.connection.is_connected():
            self.connection.close()
            self.connection = None
