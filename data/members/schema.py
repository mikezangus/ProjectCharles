schema = [
    "bio_id",
    "congress",
    "chamber",
    "state",
    "last_name",
    "first_name",
    "party"
]


class Record:
    __slots__ = schema
    def __init__(self, **kwargs):
        for key, value in kwargs.items():
            if key not in self.__slots__:
                raise KeyError(f"""
                    \n{__file__}
                    Error | Invalid field: {key}
                    Valid fields: {', '.join(self.__slots__)}
                """)
            setattr(self, key, value)
