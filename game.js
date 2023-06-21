import {
	setNewCoordinates,
	collision,
	badPosition,
	checkCollision,
} from "./controllers.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const game_defaults = {
	direction: "left",
	height: 500,
	width: 400,
	score: 0,
	lives: 0,
	cellSize: 30,
};
const rottenImg = new Image();
rottenImg.src = "./assets/rotten.png";

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
	upright: new Image(),
	downright: new Image(),
	upleft: new Image(),
	downleft: new Image(),
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
snakeBody.right.src = "./assets/body_horizontal.png";
snakeBody.left.src = "./assets/body_horizontal.png";

snakeBody.rightdown.src = "./assets/body_bottomleft.png";
snakeBody.upleft.src = "./assets/body_bottomleft.png";

snakeBody.rightup.src = "./assets/body_topleft.png";
snakeBody.downleft.src = "./assets/body_topleft.png";

snakeBody.downright.src = "./assets/body_topright.png";
snakeBody.leftup.src = "./assets/body_topright.png";

snakeBody.upright.src = "./assets/body_bottomright.png";
snakeBody.leftdown.src = "./assets/body_bottomright.png";

appleImg.src = "./assets/apple.png";
bonusImg.src = "./assets/bonus.png";

const keyEvent = {
	ArrowDown: "down",
	ArrowUp: "up",
	ArrowLeft: "left",
	ArrowRight: "right",
};

const game = (options) => {
	let apple, bonus, snake, rotten, bonusFlag, score, lives, level, speed;

	const myData = { ...game_defaults, ...options };
	let { cellSize, width, height } = myData;

	const init = () => {
		canvas.width = width;
		canvas.height = height;
		bonusFlag = 0;
		score = 0;
		lives = 0;
		level = 1;
		speed = myData.speed;
		rotten = setNewCoordinates(canvas, cellSize);
		rotten.active = false;
		apple = setNewCoordinates(canvas, cellSize);
		snake = [setNewCoordinates(canvas, cellSize)];
		snake[0].direction = myData.direction;
		bonus = setNewCoordinates(canvas, cellSize);
		bonus.active = false;
	};

	const respawn = () => {
		const centerX = Math.floor(canvas.width / (2 * cellSize)) * cellSize;
		const centerY = Math.floor(canvas.height / (2 * cellSize)) * cellSize;

		let dx = snake[0].x - centerX;
		let dy = snake[0].y - centerY;

		snake.forEach((body) => {
			body.x = body.x - dx;
			body.y = body.y - dy;
		});
	};

	const drawRotten = () => {
		if (rotten.active) {
			ctx.drawImage(rottenImg, rotten.x, rotten.y, cellSize, cellSize);
		}
	};
	const drawBonus = () => {
		if (bonus.active) {
			ctx.drawImage(bonusImg, bonus.x, bonus.y, cellSize, cellSize);
		}
	};
	const drawApple = () => {
		ctx.drawImage(appleImg, apple.x, apple.y, cellSize, cellSize);
	};

	const drawSnake = () => {
		let snakeImage;

		snake.forEach((body, index) => {
			if (index === 0) {
				snakeImage = snakeHead[body.direction];
			} else {
				let prevBody = snake[index - 1];
				snakeImage = snakeBody[body.direction];

				if (index === snake.length - 1) {
					snakeImage = snakeTail[body.direction];
				}
				if (prevBody.direction !== body.direction) {
					snakeImage = snakeBody[`${body.direction}${prevBody.direction}`];
				}
			}

			ctx.drawImage(snakeImage, body.x, body.y, cellSize, cellSize);
		});
	};

	const draw = () => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawApple();
		drawRotten();
		drawBonus();
		drawSnake();
	};
	const gotApple = () => {
		score += 10;
		speed -= 10;
		++bonusFlag;
		bonus.active = bonusFlag > 1 ? true : false;
		apple = setNewCoordinates(canvas, cellSize);
		if (score % 3 === 0) {
			++level;
		}
		if (level % 2 === 0) {
			rotten.active = true;
		}
	};
	const gotBonus = () => {
		if (bonus.active) {
			++lives;
			bonusFlag = 0;
			bonus = setNewCoordinates(canvas, cellSize);
			bonus.active = false;
		}
	};
	const gotRotten = () => {
		if (rotten.active) {
			--lives;
			bonusFlag = 0;
			rotten = setNewCoordinates(canvas, cellSize);
			rotten.active = false;

			if (lives >= 0) {
				respawn();
			}
		}
	};
	const caughtFood = (head) => {
		let foods = [apple, bonus, rotten];
		let res = foods.find((food) => food.x === head.x && food.y === head.y);
		if (res === apple) {
			gotApple();
		} else {
			snake.pop();
			if (res === bonus) {
				gotBonus();
			}
			if (res === rotten) {
				gotRotten();
			}
		}
	};

	const checkCollisions = (head) => {
		if (badPosition(snake, head, canvas)) {
			--lives;
			bonusFlag = 0;
			rotten = setNewCoordinates(canvas, cellSize);
			rotten.active = false;
			if (lives >= 0) {
				respawn();
			}
		} else {
			snake.unshift(head);
			caughtFood(head);
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
		}
	};

	const moveSnake = () => {
		let head = { x: snake[0].x, y: snake[0].y, direction: myData.direction };
		switch (myData.direction) {
			case "down":
				head.y += cellSize;
				break;
			case "up":
				head.y -= cellSize;
				break;
			case "right":
				head.x += cellSize;
				break;
			case "left":
				head.x -= cellSize;
				break;
			default:
				break;
		}
		checkCollisions(head);
	};

	const getScore = () => score;
	const getLives = () => lives;
	const getLevel = () => level;
	const getSpeed = () => speed;
	const hasCollided = () => lives < 0;
	return {
		init,
		handleKeyPressed,
		draw,
		moveSnake,
		checkCollisions,
		hasCollided,
		getScore,
		getLives,
		getLevel,
		getSpeed,
	};
};
export default game;
