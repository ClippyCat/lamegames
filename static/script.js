const table = document.getElementById('minesweeper');
const cells = document.querySelectorAll('table button');

cells.forEach(function (cell) {
	cell.addEventListener('click', function (e) {
//		write_message("Clickaroni!");
		const btn=e.target
		const x = parseInt(btn.parentElement.getAttribute("data-col"));
		const y = parseInt(btn.parentElement.getAttribute("data-row"));
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
			const msg = x+ ", "+ y + ": " + btn.innerText;
			write_message(msg);
		})
		.catch(error => console.error('Error:', error));
	});
});
