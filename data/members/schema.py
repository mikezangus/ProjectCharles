class Record:
    __slots__ = (
        "bio_id",
        "last_name",
        "first_name",
        "state",
        "party",
        "congress",
        "chamber"
    )
    def __init__(self, **kwargs):
        for key, value in kwargs.items():
            if key not in self.__slots__:
                raise KeyError(f"""
                    \n{__file__}
                    Error | Invalid field: {key}
                    Valid fields: {', '.join(self.__slots__)}
                """)
            super().__setattr__(key, value)
