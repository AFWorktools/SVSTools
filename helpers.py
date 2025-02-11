import datetime

types = {
    "8718906547001": "01 RDC",
    "8714252002010": "06 Bloemen",
    "8710400000075": "09 LDC",
    "8711382000046": "10 Note",
    "8712423014534": "14 Winkel inventaris",
}

def parse_table_row(row):
    row_data = row.split("\t")

    week = datetime.datetime.now().isocalendar().week
    day = datetime.datetime.now().isocalendar().weekday
    store = row_data[2]
    date, time = row_data[1].split(" ")
    date = date.replace(".", "-")
    amount = row_data[3]
    type = types.get(row_data[4], "Unknown")

    return {
        "week": week,
        "day": day,
        "store": store,
        "time": time,
        "amount": amount,
        "date": date,
        "type": type,
    }


def process_table_input(table_input):
    rows = []

    for row in table_input.split("\n"):
        rows.append(parse_table_row(row))

    return rows