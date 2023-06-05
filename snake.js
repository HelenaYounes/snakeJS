document.addEventListener("DOMContentLoaded", () => {
	const canvas = document.getElementById("gameCanvas");
	const contx = canvas.getContext("2d");
	const startButton = document.getElementById("start");
	const pauseButton = document.getElementById("start/pause");
	let gameInterval;
	const squareSize = 20;
	let snake = [{ x: 200, y: 200 }];
	let apple = { x: 100, y: 100 };
	let head = snake[0];
	let direction = "left";

	const draw = () => {
		contx.fillStyle = "#e74c3c";
		contx.fillRect(apple.x, apple.y, squareSize, squareSize);

		snake.forEach((body) => {
			contx.fillStyle = "#2ecc71";
			contx.fillRect(body.x, body.y, squareSize, squareSize);
		});
	};

	const moveApple = () => {
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

	const handleKeyPressed = (e) => {
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
	const moveSnake = () => {
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

	const checkCollision = () => {
		const { x, y } = snake[0];
		const headInBody = snake.some((body, index) => {
			let collision = body.x === head.x && body.y === head.y;
			return index > 0 && collision;
		});
		const outOfBond =
			x >= canvas.width || x <= 0 || y >= canvas.height || y <= 0;
		if (headInBody || outOfBond) {
			gameOver();
		}
	};

	const gameOver = () => {
		clearInterval(gameInterval);
		alert("gameOver!");
		draw();
	};
	const loopGame = () => {
		contx.clearRect(0, 0, canvas.width, canvas.height);
		draw();
		moveSnake();
		checkCollision();
	};
	const start = () => {
		clearInterval(gameInterval);
		gameInterval = setInterval(loopGame, 150);
	};

	draw();
	start();
	window.addEventListener("keydown", handleKeyPressed);
});
