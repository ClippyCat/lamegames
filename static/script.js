const table = document.getElementById('minesweeper');
const cells = document.querySelectorAll('table button');

cells.forEach(function (cell) {
	cell.addEventListener('click', function () {
		write_message("Clickaroni!");
		const x = cell.parent.attr("data-col");
		const y = cell.parent.parent.attr("data-row");
		
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
