from flask import Flask, render_template, request, jsonify
import random

app = Flask(__name__)

# Game parameters
WIDTH = 10
HEIGHT = 10
MINES = 20
BOMB_TILE = 'B'
EMPTY_TILE = EMTPY_TILE

# Initialize the game board
board = [[EMTPY_TILE for _ in range(WIDTH)] for _ in range(HEIGHT)]
mines = [(random.randint(0, WIDTH-1), random.randint(0, HEIGHT-1)) for _ in range(MINES)]
for mine in mines:
	board[mine[1]][mine[0]] = BOMB_TILE

# count adjacent mines
def count_adjacent_mines(x, y):
	count = 0
	for dx in [-1, 0, 1]:
		for dy in [-1, 0, 1]:
			nx, ny = x + dx, y + dy
			if 0 <= nx < WIDTH and 0 <= ny < HEIGHT and board[ny][nx] == BOMB_TILE:
				count += 1
	return count

# Route for the main page
@app.route('/')
def index():
	return render_template('index.html', board=board)

# AJAX endpoint for handling clicks
@app.route('/click', methods=['POST'])
def click():
	data = request.get_json()
	x, y = data['x'], data['y']

	if board[y][x] == BOMB_TILE:
		# Game over
		return jsonify({'status': 'game_over'})

	# Check for adjacent mines
	count = count_adjacent_mines(x, y)
	board[y][x] = str(count)

	return jsonify({'status': 'success', 'count': count})


if __name__ == '__main__':
	app.run(
		host='0.0.0.0', port=8000,
		debug=True
	)
