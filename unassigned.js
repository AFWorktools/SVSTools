Date.prototype.getWeek = function() {
	var date = new Date(this.getTime());
	date.setHours(0, 0, 0, 0);

	// Thursday in current week decides the year.
	date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);

	// January 4 is always in week 1.
	var week1 = new Date(date.getFullYear(), 0, 4);

	// Adjust to Thursday in week 1 and count number of weeks from date to week1.
	return 1 + Math.round(
		((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7
	);
}

function getTableFromInput() {
	let tableHTML = document.getElementById('tableInput').value;
	let parser = new DOMParser();
	let doc = parser.parseFromString(tableHTML, 'text/html');

	return doc.querySelector('tbody');
}

function getSupplierCode(SOPU) {
	const suppliers = {
		"8718906547001": "01 RDC",
		"8714252002010": "06 Bloemen",
		"8710400000075": "09 LDC",
		"8711382000046": "10 Note",
		"8712423014534": "14 Winkel inventaris",
	}

	return suppliers[SOPU];
}

function getFormattedRow(row) {
	const datetime = row.querySelector("[data-field=DELIVERYTIME]").innerText.trim().replaceAll(".", "-").split(" ");

	const [datum, tijd] = datetime;
	const suppliers = {
		"8718906547001": "01 RDC",
		"8714252002010": "06 Bloemen",
		"8710400000075": "09 LDC",
		"8711382000046": "10 Note",
		"8712423014534": "14 Winkel inventaris",
	}

	const week = new Date().getWeek();
	const dag = new Date().getDay();
	const filiaal = row.querySelector("[data-field=STORENO]").innerText
	const aantal = row.querySelector("[data-field=LCS]").innerText
	const stroom = suppliers[row.querySelector("[data-field=SOPU]").innerText];

	const tableRow = document.createElement('tr');
	tableRow.innerHTML = `
		<td>${week}</td>
		<td>${dag}</td>
		<td>${filiaal}</td>
		<td>${tijd}</td>
		<td>${aantal}</td>
		<td>${datum}</td>
		<td>${stroom}</td>
    `;

	// copy row on click
	tableRow.addEventListener('click', () => {
		copyRow(tableRow)
		tableRow.classList.add('clicked');
        setTimeout(() => {
            tableRow.classList.remove('clicked');
        }, 500);
});

    return tableRow;
}

function copyRow(row) {
	let cells = row.querySelectorAll('td');
    let rowData = Array.from(cells).map(cell => cell.innerText).join('\t');

	navigator.clipboard.writeText(rowData);
}

function copyAllRows() {
    let table = document.getElementById('outputTable');
    let rows = table.querySelectorAll('tr');

    let allData = Array.from(rows).map(row => {
        let cells = row.querySelectorAll('td');
        return Array.from(cells).map(cell => cell.innerText).join('\t');
    }).join('\n');

	navigator.clipboard.writeText(allData);
}

function convertTable() {
	const inputTable = getTableFromInput();

	let table = document.getElementById('outputTable');
	let tbody = table.querySelector('tbody');

	// clear table except header
	while (tbody.children.length > 1) {
		tbody.removeChild(tbody.lastChild);
	}

	for (row of inputTable.childNodes) {
		let newRow = getFormattedRow(row);
		tbody.appendChild(newRow);
	}
}