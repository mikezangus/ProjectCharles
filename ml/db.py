import json
import mysql.connector
from mysql.connector.connection import MySQLConnection


class DB:

    def __init__(self, config_path):
        self.config = self._load_config(config_path)
        self.connection: MySQLConnection = None

    def _load_config(self, config_path: str) -> dict[str, str]:
        with open(config_path, "r") as config_file:
            return json.load(config_file)
    
    def connect(self):
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
    
    def query(self, query: str, params: tuple = None):
        self.connect()
        try:
            with self.connection.cursor(dictionary=True) as cursor:
                cursor.execute(query, params or ())
                return cursor.fetchall()
        except mysql.connector.Error as e:
            print("Query error:\n", e)
            return []
    
    def execute(self, query: str, params: tuple | list = None):
        self.connect()
        try:
            with self.connection.cursor() as cursor:
                cursor.execute(query, params or ())
                self.connection.commit()
        except mysql.connector.Error as e:
            print("Execution error:\n", e)
            self.connection.rollback()

    def close(self):
        if self.connection and self.connection.is_connected():
            self.connection.close()
            self.connection = None
