import {
	apple,
	chest,
	snake,
	score,
	lives,
	highestscore,
	canDrawChest,
	apples,
	direction,
	speed,
	setNewCoordinates,
	updateDoc,
	collision,
	checkCollision,
	checkBounds,
	gameOver,
} from "./controllers.js";
const game = () => {
	const canvas = document.getElementById("gameCanvas");
	const ctx = canvas.getContext("2d");
	const gridSize = 20;
	const snakeBody = new Image();
	snakeBody.src = "body.png";
	const appleImg = new Image();
	appleImg.src = "apple.png";
	const chestImg = new Image();
	chestImg.src = "chest.png";
	const init = () => {
		apple = setNewCoordinates(canvas, gridSize);
		snake = [setNewCoordinates(canvas, gridSize)];
		chest = setNewCoordinates(canvas, gridSize);
		speed = 200;
		lives = 0;
		highestscore = Number(localStorage.getItem("highestscore")) || 0;
		canDrawChest = false;
		apples = 0;
		direction = "left";
		score = 0;
	};
	const respawn = () => {
		lives--;
		updateDoc("lives", lives);
		let centerX = Math.floor(canvas.width / 2);
		let centerY = Math.floor(canvas.height / 2);

		let dx = snake[0].x - centerX;
		let dy = snake[0].y - centerY;

		snake.forEach((body) => {
			body.x = body.x - dx;
			body.y = body.y - dy;
		});
		snake[0] = { x: centerX, y: centerY };
	};

	const increaseScore = () => {
		score += 10;
		canDrawChest = apples > 2;
		updateDoc("score", score);
		apples++;
		if (score > highestscore) {
			highestscore = score;
			updateDoc("highestscore", highestscore);
		}
		apple = setNewCoordinates();
	};

	const increaseChest = () => {
		lives++;
		apples = 0;
		updateDoc("lives", lives);
		canDrawChest = false;
		chest = setNewCoordinates();
	};

	const drawChest = () => {
		if (canDrawChest) {
			ctx.drawImage(chestImg, chest.x, chest.y);
		}
	};
	const drawApple = () => {
		ctx.drawImage(appleImg, apple.x, apple.y);
	};

	const drawSnake = () => {
		snake.forEach((body) => {
			ctx.drawImage(snakeBody, body.x, body.y);
		});
	};

	const draw = () => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawApple();
		drawChest();
		drawSnake();
	};
	const updateSnake = (head) => {
		if (
			checkBounds(head, canvas) ||
			checkCollision([...snake.slice(1)], head)
		) {
			lives > 0 ? respawn() : gameOver();
		}
		if (collision(head, apple)) {
			increaseScore();
		}
		snake.pop();
		if (collision(head, chest) && canDrawChest) {
			increaseChest();
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
			default:
				direction = "left";
		}
	};
	const moveSnake = () => {
		let head = { ...snake[0] };

		switch (direction) {
			case "down":
				head = { x: head.x, y: head.y + gridSize };
				break;
			case "up":
				head = { x: head.x, y: head.y - gridSize };
				break;
			case "right":
				head = { x: head.x + gridSize, y: head.y };
				break;
			case "left":
				head = { x: head.x - gridSize, y: head.y };
				break;
		}
		snake.unshift(head);
		updateSnake(head);
	};
	init();
	return {
		handleKeyPressed,
		draw,
		moveSnake,
		updateSnake,
	};
};
export default game;
