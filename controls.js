export const draw = () => {
	contx.fillStyle = "#e74c3c";
	contx.fillRect(apple.x, apple.y, squareSize, squareSize);

	snake.forEach((body) => {
		contx.fillStyle = "#2ecc71";
		contx.fillRect(body.x, body.y, squareSize, squareSize);
	});
};
export const isOutOfBounds = (el) => {
	let outOfYaxis = el.y >= canvas.height || el.y <= 0;
	let outOfXaxis = el.x >= canvas.width || el.x <= 0;
	return outOfXaxis || outOfYaxis;
};
export const moveApple = () => {
	apple.x =
		Math.floor((Math.random() * canvas.width) / squareSize) * squareSize;
	apple.y =
		Math.floor((Math.random() * canvas.height) / squareSize) * squareSize;
	snake.forEach((part) => {
		if (part.x === apple.x && part.y === apple.y) {
			moveApple();
		}
	});
};

export const handleKeyPressed = (e) => {
	switch (e.key) {
		case "ArrowDown":
			direction = direction !== "up" ? "down" : direction;
			break;
		case "ArrowUp":
			direction = direction !== "down" ? "up" : direction;
			break;
		case "ArrowRight":
			direction = direction !== "left" ? "right" : direction;
			break;
		case "ArrowLeft":
			direction = direction !== "right" ? "left" : direction;
			break;
	}
};
export const moveSnake = () => {
	let { x, y } = snake[0];
	let newHead;
	switch (direction) {
		case "down":
			newHead = { x: x, y: y + squareSize };

			break;
		case "up":
			newHead = { x: x, y: y - squareSize };

			break;
		case "right":
			newHead = { x: x + squareSize, y: y };

			break;
		case "left":
			newHead = { x: x - squareSize, y: y };

			break;
	}
	snake.unshift(newHead);

	if (newHead.x === apple.x && newHead.y === apple.y) {
		moveApple();
	} else {
		snake.pop();
	}
};

export const checkCollision = (el) => {
	const headInBody = snake.some((body, index) => {
		let collision = body.x === el.x && body.y === el.y;
		return index !== 0 && collision;
	});
};
export const checkGameOver = () => {
	if (checkCollision(snake[0]) || isOutOfBounds(snake[0])) {
		gameOver();
	}
};

export const gameOver = () => {
	clearInterval(gameInterval);
	alert("gameOver!");
	draw();
};
export const loopGame = () => {
	contx.clearRect(0, 0, canvas.width, canvas.height);
	draw();
	moveSnake();
	checkGameOver();
};
export const start = () => {
	clearInterval(gameInterval);
	gameInterval = setInterval(loopGame, 150);
};
