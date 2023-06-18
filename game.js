import { setNewCoordinates, collision, badPosition } from "./controllers.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const game_defaults = {
	direction: "left",
	height: 500,
	width: 400,
	score: 0,
	lives: 0,
	gridSize: 20,
};

const snakeHead = {
	up: new Image(),
	down: new Image(),
	left: new Image(),
	right: new Image(),
};
const snakeBody = {
	up: new Image(),
	down: new Image(),
	left: new Image(),
	right: new Image(),
	rightup: new Image(),
	rightdown: new Image(),
	leftup: new Image(),
	leftdown: new Image(),
};
const snakeTail = {
	up: new Image(),
	down: new Image(),
	left: new Image(),
	right: new Image(),
};
const appleImg = new Image();
const bonusImg = new Image();

snakeHead.up.src = "./assets/head_up.png";
snakeHead.down.src = "./assets/head_down.png";
snakeHead.left.src = "./assets/head_left.png";
snakeHead.right.src = "./assets/head_right.png";

snakeTail.up.src = "./assets/tail_down.png";
snakeTail.down.src = "./assets/tail_up.png";
snakeTail.right.src = "./assets/tail_left.png";
snakeTail.left.src = "./assets/tail_right.png";

snakeBody.down.src = "./assets/body_vertical.png";
snakeBody.up.src = "./assets/body_vertical.png";
snakeBody.leftdown.src = "./assets/body_bottomleft.png";
snakeBody.rightdown.src = "./assets/body_bottomright.png";
snakeBody.leftup.src = "./assets/body_topleft.png";
snakeBody.rightup.src = "./assets/body_topright.png";
snakeBody.right.src = "./assets/body_horizontal.png";
snakeBody.left.src = "./assets/body_horizontal.png";

appleImg.src = "./assets/apple.png";
bonusImg.src = "./assets/bonus.png";

const keyEvent = {
	ArrowDown: "down",
	ArrowUp: "up",
	ArrowLeft: "left",
	ArrowRight: "right",
};
const game = (options) => {
	let apple, bonus, snake, bonusFlag, score, lives, bodyImage;
	const myData = { ...game_defaults, ...options };
	let { gridSize, width, height } = myData;

	const init = () => {
		canvas.width = width;
		canvas.height = height;
		bonusFlag = 0;
		score = 0;
		lives = 0;
		apple = setNewCoordinates(canvas, gridSize);
		snake = [setNewCoordinates(canvas, gridSize)];
		bonus = setNewCoordinates(canvas, gridSize);
	};

	const respawn = () => {
		let centerX = Math.floor(canvas.width / 2);
		let centerY = Math.floor(canvas.height / 2);

		let dx = snake[0].x - centerX;
		let dy = snake[0].y - centerY;
		snake.shift();
		snake.forEach((body) => {
			body.x = body.x - dx;
			body.y = body.y - dy;
		});
		snake.unshift({ x: centerX, y: centerY });
	};

	const drawBonus = () => {
		if (bonusFlag > 2) {
			ctx.drawImage(bonusImg, bonus.x, bonus.y, gridSize, gridSize);
		}
	};
	const drawApple = () => {
		ctx.drawImage(appleImg, apple.x, apple.y, gridSize, gridSize);
	};

	const drawSnake = () => {
		let snakeImage;
		snake.forEach((body, index) => {
			if (index === 0) {
				snakeImage = snakeHead[myData.direction];
			} else if (index > 0 && index < snake.length - 1) {
				snakeImage = bodyImage || snakeBody[myData.direction];
			} else {
				snakeImage = snakeTail[myData.direction];
			}
			ctx.drawImage(snakeImage, body.x, body.y, gridSize, gridSize);
		});
	};

	const draw = () => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawApple();
		drawBonus();
		drawSnake();
	};

	const updateSnake = (head) => {
		if (badPosition(snake, head, canvas)) {
			bonusFlag = 0;
			--lives;
			if (lives >= 0) {
				respawn();
			}
		} else {
			snake.unshift(head);
			if (collision(head)(apple)) {
				++score;
				++bonusFlag;
				apple = setNewCoordinates(canvas, gridSize);
			} else {
				snake.pop();
				if (collision(head)(bonus)) {
					++lives;
					bonusFlag = 0;
					bonus = setNewCoordinates(canvas, gridSize);
				}
			}
		}
	};

	const handleKeyPressed = (e) => {
		let newDirection = keyEvent[e.key];
		let opposite =
			newDirection === myData.direction ||
			`${newDirection}:${myData.direction}` === "up:down" ||
			`${newDirection}:${myData.direction}` === "down:up" ||
			`${newDirection}:${myData.direction}` === "left:right" ||
			`${newDirection}:${myData.direction}` === "right:left";
		if (
			!opposite &&
			(newDirection === "left" ||
				newDirection === "right" ||
				newDirection === "down" ||
				newDirection === "up")
		) {
			myData.direction = newDirection;
		} else {
			return;
		}
	};

	const moveSnake = () => {
		let head = { x: snake[0].x, y: snake[0].y };
		switch (myData.direction) {
			case "down":
				head.y += gridSize;
				break;
			case "up":
				head.y -= gridSize;
				break;
			case "right":
				head.x += gridSize;
				break;
			case "left":
				head.x -= gridSize;
				break;
			default:
				break;
		}
		updateSnake(head);
	};

	const getScore = () => score;
	const getLives = () => lives;
	return {
		init,
		handleKeyPressed,
		draw,
		moveSnake,
		updateSnake,
		getScore,
		getLives,
	};
};
export default game;
