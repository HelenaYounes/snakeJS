document.addEventListener("DOMContentLoaded", () => {
	const pauseButton = document.getElementById("startPause");
	const score = document.getElementById("score");
	const msg = document.getElementById("game-over");
	const highestScore = document.getElementById("highestScore");
	const canvas = document.getElementById("gameCanvas");
	const ctx = canvas.getContext("2d");
	const squareSize = 20;
	let gameInterval;
	let gameoverMsg;
	let snake;
	let apple;
	let head;
	let direction = "left";
	let gamePaused = true;
	let currentScore;
	let speed;
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
			default:
				direction = "down";
				break;
		}
	};
	const moveSnake = () => {
		let { x, y } = head;
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
		head = newHead;

		if (head.x === apple.x && head.y === apple.y) {
			updateScore();
			if (speed > 80) increaseSpeed();
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
		if (!isInBounds(head) || checkCollision(head)) {
			gameOver();
		}
	};

	const gameOver = () => {
		if (!!gameoverMsg) {
			clearTimeout(gameoverMsg);
		}
		gamePaused = true;
		clearInterval(gameInterval);
		toggleGameOverMsg();
		toggleText(pauseButton, "New Game");
		gameoverMsg = setTimeout(init, 1000);
	};
	const loopGame = () => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		draw();
		moveSnake();
		checkGameOver();
	};
	const increaseSpeed = () => {
		speed -= 10;
		clearInterval(gameInterval);
		gameInterval = setInterval(loopGame, speed);
		draw();
	};
	const toggleText = (b, str) => {
		b.innerText = str;
	};
	const pause = () => {
		clearInterval(gameInterval);
		gamePaused = true;
		toggleText(pauseButton, "Resume Game");
	};
	const start = () => {
		gamePaused = false;
		toggleText(pauseButton, "Pause Game");
		clearInterval(gameInterval);
		draw();
		gameInterval = setInterval(loopGame, speed);
	};

	const toggleGameOverMsg = () => {
		msg.style.opacity = 1;
	};
	const init = () => {
		msg.style.opacity = 0;
		snake = [{ x: 200, y: 200 }];
		apple = { x: 100, y: 100 };
		head = snake[0];
		currentScore = 0;
		speed = 150;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	};
	pauseButton.addEventListener("click", () => {
		gamePaused ? start() : pause();
	});
	window.addEventListener("keydown", handleKeyPressed);
	toggleText(highestScore, highscore);
	init();
});
