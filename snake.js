document.addEventListener("DOMContentLoaded", () => {
	const pauseButton = document.getElementById("startPause");
	const scr = document.getElementById("score");
	const msg = document.getElementById("game-over");
	const life = document.getElementById("lives");
	const snakeHead = new Image();
	snakeHead.src = "head.jpeg";
	const snakeTail = new Image();
	snakeTail.src = "tail.jpg";
	const snakeBody = new Image();
	snakeBody.src = "body.png";
	const appleImg = new Image();
	appleImg.src = "apple.png";
	const chestImg = new Image();
	chestImg.src = "gold.jpeg";
	const highestScr = document.getElementById("highestScore");
	const canvas = document.getElementById("gameCanvas");
	const ctx = canvas.getContext("2d");
	const squareSize = 20;
	let canDrawChest;
	let gameInterval;
	let gameoverMsg;
	let snake;
	let apple;
	let chest;
	let head;
	let apples;
	let direction = "left";
	let gamePaused;
	let score = 0;
	let speed;
	let lives = 0;
	let newSpeed;
	let highestScore = Number(window.localStorage.getItem("highestscore")) || 0;

	const moveItem = (item) => {
		item.x =
			Math.floor((Math.random() * canvas.width) / squareSize) * squareSize;
		item.y =
			Math.floor((Math.random() * canvas.height) / squareSize) * squareSize;
		snake.forEach((part) => {
			if (part.x === item.x && part.y === item.y) {
				moveItem(item);
			}
		});
	};
	const drawChest = () => {
		if (canDrawChest) {
			ctx.drawImage(
				chestImg,
				chest.x - squareSize,
				chest.y - squareSize,
				squareSize,
				squareSize
			);
		}
	};
	const drawApple = () => {
		ctx.drawImage(
			appleImg,
			apple.x - squareSize,
			apple.y - squareSize,
			squareSize,
			squareSize
		);
	};

	const drawSnake = () => {
		snake.forEach((body) => {
			let img = body === snake[0] ? snakeHead : snakeBody;
			ctx.drawImage(
				img,
				body.x - squareSize,
				body.y - squareSize,
				squareSize,
				squareSize
			);
		});
	};
	const draw = () => {
		drawApple();
		drawChest();
		drawSnake();
	};
	const isOutBounds = (el) => {
		let inYaxis = el.y > 0 && el.y < canvas.height;
		let inXaxis = el.x > 0 && el.x < canvas.width;
		return !inXaxis || !inYaxis;
	};

	const checkSpeed = () => {
		moveItem(apple);
		if (speed !== newSpeed) {
			speed = newSpeed;
			clearInterval(gameInterval);
			gameInterval = setInterval(loopGame, speed);
		}
	};
	const setHigherScore = () => {
		if (score > highestScore) {
			highestScore = score;
			window.localStorage.setItem("highestscore", highestScore.toString());
		}
	};

	const updateScore = () => {
		apples++;
		canDrawChest = apples > 2;
		score += 10;

		newSpeed = speed - 20;
		setHigherScore();
		checkSpeed();
	};

	const checkGameOver = () => {
		if (lives < 0) {
			gameOver();
		} else {
			snake[0] = { x: 100, y: 200 };
			pause();
		}
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
	const updateChest = () => {
		lives += 1;
		apples = 0;
		canDrawChest = false;
		moveItem(chest);
	};
	const caughtItem = () => {
		let items = [apple, chest];
		let res = items.find((item) => head.x === item.x && head.y === item.y);
		switch (res) {
			case undefined: {
				snake.pop();
				break;
			}
			case apple: {
				updateScore();
				break;
			}
			case chest: {
				snake.pop();
				updateChest();
				break;
			}
		}
		updateHTML();
	};

	const clearSetTimeout = () => {
		if (!!gameoverMsg) {
			clearTimeout(gameoverMsg);
		}
	};
	const clearGameInterval = () => {
		if (!!gameInterval) {
			clearInterval(gameInterval);
		}
	};
	const gameOver = () => {
		clearSetTimeout();
		gamePaused = true;

		clearInterval(gameInterval);
		msg.style.opacity = 1;
		toggleText(pauseButton, "New Game");
		gameoverMsg = setTimeout(init, 1000);
	};

	const checkCollisionBody = (el) => {
		const headInBody = snake.some((body, index) => {
			let collision = body.x === el.x && body.y === el.y;
			return index !== 0 && collision;
		});
	};
	const checkCollision = () => {
		if (isOutBounds(snake[0]) || checkCollisionBody(snake[0])) {
			lives -= 1;
			clearGameInterval();
			checkGameOver();
		} else {
			caughtItem();
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
		head = newHead;
		checkCollision();
	};
	const updateHTML = () => {
		life.textContent = lives.toString();
		highestScr.textContent = highestScore.toString();
		scr.textContent = score.toString();
	};
	const toggleText = (b, str) => {
		b.textContent = str;
	};

	const pause = () => {
		clearInterval(gameInterval);
		gamePaused = true;
		toggleText(pauseButton, "Resume Game");
	};
	const loopGame = () => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		draw();
		moveSnake();
	};
	const start = () => {
		gamePaused = false;
		toggleText(pauseButton, "Pause Game");
		clearGameInterval();
		gameInterval = setInterval(loopGame, speed);
		draw();
	};

	const toggleGameOverMsg = () => {
		msg.style.opacity = 1;
	};
	const init = () => {
		clearSetTimeout();
		clearGameInterval();
		msg.style.opacity = 0;
		snake = [{ x: 200, y: 200 }];
		apple = { x: 100, y: 100 };
		chest = { x: 200, y: 300 };
		head = snake[0];

		score = 0;
		speed = 150;
		lives = 0;
		apples = 0;
		canDrawChest = false;
		gamePaused = true;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	};
	pauseButton.addEventListener("click", () => {
		gamePaused ? start() : pause();
	});
	window.addEventListener("keydown", handleKeyPressed);
	updateHTML();
	init();
});
