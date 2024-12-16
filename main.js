document.querySelector("#codeToCopy").addEventListener("click", (event) => {
	// select the code
	const range = document.createRange();
	const selection = window.getSelection();
	range.selectNodeContents(event.target);
	selection.removeAllRanges();
	selection.addRange(range);

	// copy the code
	const code = event.target.innerText;
	copyToClipboard(code);
});