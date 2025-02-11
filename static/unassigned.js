function animateClick(element) {
	element.classList.add('clicked');
	setTimeout(() => {
		element.classList.remove('clicked');
	}, 500);
}

function copyRow(row) {
	let cells = row.querySelectorAll('td');
    let rowData = Array.from(cells).map(cell => cell.innerText).join('\t');

	navigator.clipboard.writeText(rowData);
}

function copyAllRows() {
    let table = document.getElementById('outputTable');
    let rows = table.querySelectorAll('tr:not(:first-child)'); // Skip the first row (header)

    let allData = Array.from(rows).map(row => {
        let cells = row.querySelectorAll('td');
        return Array.from(cells).map(cell => cell.innerText).join('\t');
    }).join('\n');

	navigator.clipboard.writeText(allData);

	animateClick(
		document.getElementById('copy-all-button')
	);
}
