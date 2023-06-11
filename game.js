const game = () => {
	// const life = document.getElementById("lives");
	// const highestScr = document.getElementById("highestScore");
	// const scr = document.getElementById("score");
	const canvas = document.getElementById("gameCanvas");
	const ctx = canvas.getContext("2d");
	const canvaSize = { width: 800, height: 600 };
	const squareSize = 30;
	let apple, chest, snake, canDrawChest, apples, direction, speed, score, lives;
	const snakeBody = new Image();
	snakeBody.src = "body.png";
	const appleImg = new Image();
	appleImg.src = "apple.png";
	const chestImg = new Image();
	chestImg.src = "chest.png";

	const setNewCoordinates = () => {
		let randX =
			Math.floor(Math.random() * (canvaSize.width / squareSize)) * squareSize;
		let randY =
			Math.floor(Math.random() * (canvaSize.height / squareSize)) * squareSize;
		return { x: randX, y: randY };
	};
	const init = () => {
		apple = setNewCoordinates();
		chest = setNewCoordinates();
		snake = [setNewCoordinates()];
		speed = 200;
		canDrawChest = false;
		apples = 0;
		direction = "left";
		score = 0;
		lives = 0;
	};
	const getCenter = () => {
		centerX = Math.floor(canvaSize.width / 2);
		centerY = Math.floor(canvaSize.height / 2);

		let dx = snake[0].x - centerX;
		let dy = snake[0].y - centerY;
		let newHead = { x: centerX, y: centerY };
		snake.shift();
		snake.forEach((body) => {
			body.x = body.x - dx;
			body.y = body.y - dy;
		});
		snake.unshift(newHead);
	};

	const changeDirection = () => {
		switch (direction) {
			case "left":
				direction = "right";
				break;
			case "right":
				direction = "left";
				break;
			case "up":
				direction = "down";
				break;
			case "down":
				direction = "up";
				break;
		}
	};
	const bodyCollision = () => {
		let collided = snake.findLastIndex(
			(body) => snake[0].x === body.x && snake[0].y === body.y
		);
		return collided > 0;
	};

	const isInBounds = () => {
		let isInXaxis = snake[0].x > 0 && snake[0].x < canvaSize.width;
		let isInYaxis = snake[0].y > 0 && snake[0].y < canvaSize.height;
		return isInXaxis && isInYaxis;
	};

	const increaseScore = () => {
		score += 10;
		// scr.textContent = `${score}`;
		apples++;
		canDrawChest = apples > 2;
		apple = setNewCoordinates();
	};

	const updateLives = () => {
		lives += 1;
		apples = 0;
		canDrawChest = false;
		// life.textContent = `${lives}`;
		chest = setNewCoordinates();
	};
	const checkCollision = () => {
		if (snake[0].x === apple.x && snake[0].y === apple.y) {
			increaseScore();
		} else if (
			snake[0].x === chest.x &&
			snake[0].y === chest.y &&
			canDrawChest
		) {
			snake.pop();
			updateLives();
		} else {
			snake.pop();
		}
	};

	const checkGameOver = () => {
		if (lives < 0) {
			alert("gameOver");
		}
	};

	const checkPosition = () => {
		if (isInBounds() && !bodyCollision()) {
			checkCollision();
		} else {
			lives--;
			checkGameOver();
		}
	};
	const drawApple = () => {
		ctx.drawImage(appleImg, apple.x, apple.y);
	};
	const drawChest = () => {
		if (canDrawChest) {
			ctx.drawImage(chestImg, chest.x, chest.y);
		}
	};

	const drawSnake = () => {
		snake.forEach((body) => {
			ctx.drawImage(snakeBody, body.x, body.y);
		});
	};

	const draw = () => {
		ctx.clearRect(0, 0, canvaSize.width, canvaSize.height);
		drawApple();
		drawChest();
		drawSnake();
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
				direction = "left";
		}
	};
	const moveSnake = () => {
		let head = { ...snake[0] };

		switch (direction) {
			case "down":
				head = { x: head.x, y: head.y + squareSize };
				break;
			case "up":
				head = { x: head.x, y: head.y - squareSize };
				break;
			case "right":
				head = { x: head.x + squareSize, y: head.y };
				break;
			case "left":
				head = { x: head.x - squareSize, y: head.y };
				break;
		}
		snake.unshift(head);
	};

	document.addEventListener("DOMContentLoaded", init);
	return {
		init,
		handleKeyPressed,
		draw,
		moveSnake,
		checkPosition,
	};
};
export default game;
