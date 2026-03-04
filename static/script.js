const getBtn = (x, y) => document.querySelector(`button[data-col="${x}"][data-row="${y}"]`);

function applyReveal(cells) {
	cells.forEach(({x, y, count}) => {
		const btn = getBtn(x, y);
		btn.textContent = count > 0 ? count : '';
		btn.classList.add('revealed', `n${count}`);
		btn.disabled = true;
	});
}

function revealMines(mines) {
	mines.forEach(({x, y}) => {
		const btn = getBtn(x, y);
		btn.textContent = '💣';
		btn.classList.add('mine');
		btn.disabled = true;
	});
}

function resetBoard() {
	document.querySelectorAll('table button').forEach(btn => {
		btn.textContent = '';
		btn.className = '';
		btn.disabled = false;
	});
}

document.querySelectorAll('table button').forEach(btn => {
	btn.addEventListener('click', function () {
		const x = parseInt(this.dataset.col);
		const y = parseInt(this.dataset.row);
		fetch('/click', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({x, y}),
		})
		.then(r => r.json())
		.then(data => {
			if (data.status === 'game_over') {
				revealMines(data.mines);
				write_message('<b>💥 Game over! You hit a mine.</b>');
			} else if (data.status === 'win') {
				applyReveal(data.cells);
				write_message('<b>🎉 You win!</b>');
			} else if (data.status === 'ok') {
				applyReveal(data.cells);
				const count = data.cells[0]?.count ?? '';
				write_message(`(${x}, ${y}): ${count}`);
			}
		})
		.catch(err => console.error(err));
	});

	btn.addEventListener('contextmenu', function (e) {
		e.preventDefault();
		const x = parseInt(this.dataset.col);
		const y = parseInt(this.dataset.row);
		fetch('/flag', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({x, y}),
		})
		.then(r => r.json())
		.then(data => {
			if (data.status === 'ok') {
				this.textContent = data.flagged ? '🚩' : '';
				this.classList.toggle('flagged', data.flagged);
				write_message(`(${x}, ${y}): ${data.flagged ? 'Flagged' : 'Unflagged'}`);
			}
		});
	});
});

document.getElementById('new-game').addEventListener('click', function () {
	fetch('/new-game', {method: 'POST'})
		.then(r => r.json())
		.then(() => {
			resetBoard();
			write_message('<i>New game started!</i>');
		});
});
