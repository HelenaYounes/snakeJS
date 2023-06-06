document.addEventListener("DOMContentLoaded", () => {
	const pauseButton = document.getElementById("startPause");
	const score = document.getElementById("score");
	const highestScore = document.getElementById("highestScore");
	const canvas = document.getElementById("gameCanvas");
	const ctx = canvas.getContext("2d");
	let gameInterval;
	const squareSize = 20;
	let snake = [{ x: 200, y: 200 }];
	let apple = { x: 100, y: 100 };
	let head = snake[0];
	let direction = "left";
	let gamePaused = true;
	let currentScore = 0;
	let highscore = Number(window.localStorage.getItem("highscore")) || 0;

	const draw = () => {
		ctx.fillStyle = "#e74c3c";
		ctx.fillRect(
			apple.x - squareSize,
			apple.y - squareSize,
			squareSize,
			squareSize
		);

		snake.forEach((body) => {
			ctx.fillStyle = "#2ecc71";
			ctx.fillRect(
				body.x - squareSize,
				body.y - squareSize,
				squareSize,
				squareSize
			);
		});
	};
	const isInBounds = (el) => {
		let inYaxis = el.y <= canvas.height && el.y >= 0;
		let inXaxis = el.x <= canvas.width && el.x >= 0;
		return inXaxis && inYaxis;
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

	const updateScore = () => {
		currentScore += 10;
		if (currentScore > highscore) {
			highscore = currentScore;
			window.localStorage.setItem("highscore", currentScore.toString());
			toggleText(highestScore, highscore);
		}
		toggleText(score, currentScore);
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
			updateScore();
			moveApple();
		} else {
			snake.pop();
		}
	};

	const checkCollision = (el) => {
		const headInBody = snake.some((body, index) => {
			let collision = body.x === el.x && body.y === el.y;
			return index !== 0 && collision;
		});
	};
	const checkGameOver = () => {
		if (!isInBounds(snake[0]) || checkCollision(snake[0])) {
			gameOver();
		}
	};

	const gameOver = () => {
		clearInterval(gameInterval);
		alert("gameOver!");
	};
	const loopGame = () => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		draw();
		moveSnake();
		checkGameOver();
	};

	const toggleText = (b, str) => {
		b.innerText = str;
	};
	const pause = () => {
		clearInterval(gameInterval);
		gamePaused = true;
		toggleText(pauseButton, "start");
	};
	const start = () => {
		gamePaused = false;
		toggleText(pauseButton, "pause");
		if (!!gameInterval) clearInterval(gameInterval);
		draw();
		gameInterval = setInterval(loopGame, 200);
	};
	const init = () => {
		window.addEventListener("keydown", handleKeyPressed);
		currentScore = 0;
		toggleText(highestScore, highscore);
	};
	init();
	pauseButton.addEventListener("click", () => {
		gamePaused ? start() : pause();
	});
});
