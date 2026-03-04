from flask import Flask, render_template, request, jsonify
import random

app = Flask(__name__)

WIDTH = 10
HEIGHT = 10
MINES = 20


class Game:
    def __init__(self):
        self.reset()

    def reset(self):
        self.revealed = [[False] * WIDTH for _ in range(HEIGHT)]
        self.flagged = [[False] * WIDTH for _ in range(HEIGHT)]
        self.board = [[0] * WIDTH for _ in range(HEIGHT)]
        self.over = False
        self.won = False

        mine_positions = set()
        while len(mine_positions) < MINES:
            x = random.randint(0, WIDTH - 1)
            y = random.randint(0, HEIGHT - 1)
            mine_positions.add((x, y))
        self.mines = mine_positions

        for mx, my in mine_positions:
            self.board[my][mx] = -1

        for y in range(HEIGHT):
            for x in range(WIDTH):
                if self.board[y][x] != -1:
                    self.board[y][x] = sum(
                        1
                        for dx in [-1, 0, 1]
                        for dy in [-1, 0, 1]
                        if (dx, dy) != (0, 0)
                        and 0 <= x + dx < WIDTH
                        and 0 <= y + dy < HEIGHT
                        and self.board[y + dy][x + dx] == -1
                    )

    def valid(self, x, y):
        return 0 <= x < WIDTH and 0 <= y < HEIGHT

    def flood_reveal(self, start_x, start_y):
        cells = []
        stack = [(start_x, start_y)]
        while stack:
            x, y = stack.pop()
            if not self.valid(x, y) or self.revealed[y][x] or self.flagged[y][x]:
                continue
            self.revealed[y][x] = True
            cells.append({'x': x, 'y': y, 'count': self.board[y][x]})
            if self.board[y][x] == 0:
                for dx in [-1, 0, 1]:
                    for dy in [-1, 0, 1]:
                        if dx == 0 and dy == 0:
                            continue
                        stack.append((x + dx, y + dy))
        return cells

    def click(self, x, y):
        if self.over or self.flagged[y][x] or self.revealed[y][x]:
            return {'status': 'noop'}
        if self.board[y][x] == -1:
            self.over = True
            return {
                'status': 'game_over',
                'mines': [{'x': mx, 'y': my} for mx, my in self.mines],
            }
        cells = self.flood_reveal(x, y)
        unrevealed_safe = sum(
            1
            for row in range(HEIGHT)
            for col in range(WIDTH)
            if not self.revealed[row][col] and self.board[row][col] != -1
        )
        if unrevealed_safe == 0:
            self.over = True
            self.won = True
            return {'status': 'win', 'cells': cells}
        return {'status': 'ok', 'cells': cells}

    def flag(self, x, y):
        if self.over or self.revealed[y][x]:
            return {'status': 'noop'}
        self.flagged[y][x] = not self.flagged[y][x]
        return {'status': 'ok', 'flagged': self.flagged[y][x]}


game = Game()


@app.route('/')
def index():
    return render_template('index.html', width=WIDTH, height=HEIGHT)


@app.route('/new-game', methods=['POST'])
def new_game():
    game.reset()
    return jsonify({'status': 'ok'})


@app.route('/click', methods=['POST'])
def click():
    data = request.get_json()
    x, y = data['x'], data['y']
    return jsonify(game.click(x, y))


@app.route('/flag', methods=['POST'])
def flag():
    data = request.get_json()
    x, y = data['x'], data['y']
    return jsonify(game.flag(x, y))


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
