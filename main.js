const sopuMap = {
    "8718906547001": "01 RDC",
    "8714252002010": "06 Bloemen",
    "8710400000075": "09 LDC",
    "8711382000046": "10 Note",
    "8712423007277": "12 Communicatie Containers e/o Posttassen",
    "8712423014534": "14 Winkel inventaris",
};

const months = ['jan', 'feb', 'mar', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];

function copyRow(row) {
	let cells = row.querySelectorAll('td');
    let rowData = Array.from(cells).map(cell => cell.innerText).join('\t');

	navigator.clipboard.writeText(rowData);
}

function animateClick(element) {
	element.classList.add('clicked');
	setTimeout(() => {
		element.classList.remove('clicked');
	}, 500);
}

function getRowElem(row) {
    const tableRow = document.createElement('tr');

    tableRow.innerHTML = `
        <td>${row.week}</td>
        <td>${row.day}</td>
        <td>${row.store}</td>
        <td>${row.time}</td>
        <td>${row.amount}</td>
        <td>${row.date}</td>
        <td>${row.type}</td>
    `;

    tableRow.addEventListener('click', () => {
        copyRow(tableRow);
        animateClick(tableRow);
    });

    return tableRow;
}

function updateTable(rows) {
    const tbody = document.querySelector('tbody');

    // remove all rows except header
    while (tbody.children.length > 1) {
        tbody.removeChild(tbody.lastChild);
    }

    for (const row of rows) {
        let tableRowEl = getRowElem(row);
        tbody.appendChild(tableRowEl);
    }
}

function copyAllRows() {
    let table = document.getElementById('outputTable');
    let rows = table.querySelectorAll('tr');

    let clipboardData = [];

    // skip header
    for (let rowIdx = 1; rowIdx < rows.length; rowIdx++) {
        let cells = rows[rowIdx].querySelectorAll('td');
        let rowData = Array.from(cells).map(cell => cell.innerText).join('\t');
        clipboardData.push(rowData);
    }

    let allData = clipboardData.join('\n');
    navigator.clipboard.writeText(allData);

	animateClick(document.getElementById('copy-all-button'));
}

Date.prototype.getWeek = function () {
    const date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);

    // Set the date to the nearest Thursday (ISO week starts on Monday)
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);

    // January 4th is always in week 1
    const week1 = new Date(date.getFullYear(), 0, 4);

    // Calculate the full weeks between this date and week1
    return 1 + Math.round(((date - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
};

function parseVisionInput(visionInput) {
    const rows = [];

    const today = new Date("2025-02-15");
    const currentWeek = today.getWeek();
    const currentDay = today.getDay() || 7;

    for (let row of visionInput.split("\n")) {
        let rowData = row.split("\t");

        if (rowData.length < 5) {
            alert("Ongeldige vision input");
            return [];
        }

        const sopu = rowData[4];

        let [date, time] = rowData[1].split(" "); // 11.01.2023 08:00:00 -> [11.01.2023, 08:00:00]
        time = time.slice(0, -3); // 08:00:00 -> 08:00

        const [day, month, year] = date.split('.'); // 11.01.2023 -> [11, 01, 2023]
        date = `${day}-${months[month - 1]}`; // 11-01-2023 -> 11-jan

        rows.push({
            week: currentWeek,
            day: currentDay,
            store: rowData[2],
            time: time,
            amount: rowData[3],
            date: date,
            type: sopuMap[sopu],
        });
    }

    return rows;
}

function getToolHashmap(toolData) {
    const hashedRows = {};

    // skip first 2 header rows
    for (const row of toolData.split("\n").slice(2)) {
        const rowData = row.split("\t");

        const store = rowData[2];
        const time = rowData[3];
        const amount = rowData[4];
        const date = rowData[5];
        const type = rowData[6];

        // colum 13 is 'j' if the row is marked as finished
        const finished = rowData[12] == 'j';
        
        const hash = `${store}-${time}-${amount}-${date}-${type}`;
        hashedRows[hash] = finished;
    }
    
    return hashedRows;
}

function getUnregisteredRows(toolInput, visionRows) {
    const toolHashmap = getToolHashmap(toolInput);
    const filteredRows = [];
    
    for (row of visionRows) {
        const hash = `${row.store}-${row.time}-${row.amount}-${row.date}-${row.type}`;

        if (toolHashmap[hash]) {
            filteredRows.push(row);
        }
    }

    return filteredRows;
}

function handleInput() {
    const visionInput = document.getElementById('visionInput').value;
    const toolInput = document.getElementById('toolInput').value;

    if (visionInput == "") {
        alert("Voer vision input in aub");
        return;
    }

    const visionRows = parseVisionInput(visionInput);
    const rows = (toolInput == "") ? visionRows : getUnregisteredRows(toolInput, visionRows);

    updateTable(rows);
}
