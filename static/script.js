const table = document.getElementById('minesweeper');
const cells = document.querySelectorAll('.cell');

cells.forEach(function (cell) {
	cell.addEventListener('click', function () {
		const x = cell.cellIndex;
		const y = cell.parentNode.rowIndex;

		// AJAX request to the Flask backend
		fetch('/click', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ 'x': x, 'y': y }),
		})
		.then(response => response.json())
		.then(data => {
			if (data.status === 'game_over') {
				alert('Game Over! You clicked on a mine.');
			} else {
				cell.innerText = data.count;
				cell.style.backgroundColor = "#FFFFFF"
			}
		})
		.catch(error => console.error('Error:', error));
	});
});
