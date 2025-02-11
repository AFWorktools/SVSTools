import datetime

sopu_map = {
    "8718906547001": "01 RDC",
    "8714252002010": "06 Bloemen",
    "8710400000075": "09 LDC",
    "8711382000046": "10 Note",
    "8712423007277": "12 Communicatie Containers e/o Posttassen",
    "8712423014534": "14 Winkel inventaris",
}

months = ['jan', 'feb', 'mar', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec']


def parse_table_row(row):
    row_data = row.split("\t")

    current_week = datetime.datetime.now().isocalendar().week
    current_day = datetime.datetime.now().isocalendar().weekday

    store = row_data[2]
    amount = row_data[3]
    type = sopu_map.get(row_data[4])

    date, time = row_data[1].split(" ")
    time = time[:-3] # remove seconds and :
    
    date = date.split('.')
    date = f"{date[0]}-{months[int(date[1]) - 1]}" # 11-01-2023 -> 11-jan fromat

    return {
        "week": current_week,
        "day": current_day,
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

def hashmap_tool(tool_data):
    hashed_rows = {}

    # first two rows are headers
    for row in tool_data.split("\n")[2:]:
        row_data = row.split("\t")

        store = row_data[2]
        time = row_data[3]
        amount = row_data[4]
        date = row_data[5]
        type = row_data[6]

        finished = row_data[12] == 'j\r'

        hash = f"{store}{time}{amount}{date}{type}"
        hashed_rows[hash] = finished
    
    return hashed_rows

def hashmap_vision(vision_data):
    hashed_rows = {}

    for row in vision_data.split("\n"):
        parsed_row = parse_table_row(row)

        store = parsed_row['store']
        time = parsed_row['time']
        amount = parsed_row['amount']
        date = parsed_row['date']
        type = parsed_row['type']

        hash = f"{store}{time}{amount}{date}{type}"
        hashed_rows[hash] = parsed_row
    
    return hashed_rows

def filter_table(vision_input, tool_input):
    filtered_rows = []

    tool_hashmap = hashmap_tool(tool_input)
    vision_hashmap = hashmap_vision(vision_input)

    for hash, row in vision_hashmap.items():
        if not tool_hashmap.get(hash):
            filtered_rows.append(row)

    return filtered_rows