import {
	setNewCoordinates,
	collision,
	badPosition,
	inVicinity,
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

const snakeHead = {
	up: new Image(),
	down: new Image(),
	left: new Image(),
	right: new Image(),
};
const openHead = {
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

const appleThroat = {
	up: new Image(),
	down: new Image(),
	left: new Image(),
	right: new Image(),
};

const snakeTail = {
	up: new Image(),
	down: new Image(),
	left: new Image(),
	right: new Image(),
};

const appleImg = new Image();
const bonusImg = new Image();
const rottenImg = new Image();

snakeHead.up.src = "./assets/head_up.png";
snakeHead.down.src = "./assets/head_down.png";
snakeHead.left.src = "./assets/head_left.png";
snakeHead.right.src = "./assets/head_right.png";

openHead.up.src = "./assets/openup.jpg";
openHead.down.src = "./assets/opendown.jpg";
openHead.left.src = "./assets/openleft.jpg";
openHead.right.src = "./assets/openright.jpg";

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

appleThroat.up.src = "./assets/applethroatvertical.jpg";
appleThroat.down.src = "./assets/applethroatvertical.jpg";
appleThroat.left.src = "./assets/applethroatvertical.jpg";
appleThroat.right.src = "./assets/applethroatvertical.jpg";

appleImg.src = "./assets/apple.png";
bonusImg.src = "./assets/bonus.png";
rottenImg.src = "./assets/rotten.png";

const keyEvent = {
	ArrowDown: "down",
	ArrowUp: "up",
	ArrowLeft: "left",
	ArrowRight: "right",
};

const game = (options) => {
	let apple,
		bonus,
		snake,
		rotten,
		bonusFlag,
		eatingIndexArray,
		score,
		lives,
		level,
		speed,
		mouthOpen,
		tongueOut,
		tongueInterval,
		isEating,
		tongue;

	const myData = { ...game_defaults, ...options };
	let { cellSize, width, height } = myData;

	const moveTongue = () => {
		tongueOut = !tongueOut;
	};
	const init = () => {
		canvas.width = width;
		canvas.height = height;
		bonusFlag = 0;
		score = 0;
		lives = 0;
		level = 0;
		speed = myData.speed;
		rotten = setNewCoordinates(canvas, cellSize);
		rotten.active = false;
		apple = setNewCoordinates(canvas, cellSize);
		snake = [setNewCoordinates(canvas, cellSize)];
		snake[0].direction = myData.direction;
		bonus = setNewCoordinates(canvas, cellSize);
		bonus.active = false;
		isEating = false;
		eatingIndexArray = [];
		tongue = { x: snake[0].x, y: snake[0].y };
		mouthOpen = false;
		tongueOut = true;
		tongueInterval = setInterval(moveTongue, 1000);
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

	const drawTongue = () => {
		if (!mouthOpen && tongueOut) {
			ctx.strokeStyle = "red";
			ctx.lineWidth = 4;

			ctx.beginPath(); // Start a new path
			ctx.moveTo(snake[0].x, snake[0].y);
			let endX;
			let endY;

			if (snake[0].direction === "up") {
				endY = snake[0].y - cellSize;
			} else if (snake[0].direction === "down") {
				endY = snake[0].y + cellSize;
			} else if (snake[0].direction === "left") {
				endX = snake[0].x - cellSize;
			} else if (snake[0].direction === "right") {
				endX = snake[0].x + cellSize;
			}
			ctx.lineTo(endX, endY);
			ctx.stroke();
		}
	};

	const drawSnake = () => {
		let snakeImage;

		snake.forEach((body, index) => {
			if (index === 0) {
				snakeImage = mouthOpen
					? openHead[body.direction]
					: snakeHead[body.direction];
			} else {
				let prevBody = snake[index - 1];

				snakeImage = snakeBody[body.direction];
				if (isEating && eatingIndexArray.includes(index)) {
					snakeImage = appleThroat[body.direction];
				}
				if (index === snake.length - 1 && index > 0) {
					snakeImage = snakeTail[body.direction];
					if (isEating && eatingIndexArray.includes(index)) {
						eatingIndexArray.shift();
					}
				}
				if (prevBody.direction !== body.direction) {
					snakeImage = snakeBody[`${body.direction}${prevBody.direction}`];
				}
			}

			ctx.drawImage(snakeImage, body.x, body.y, cellSize, cellSize);
		});
		isEating = eatingIndexArray.length > 0;
		if (isEating) {
			eatingIndexArray.forEach(
				(el, index) => (eatingIndexArray[index] = el + 1)
			);
		}
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

		apple = setNewCoordinates(canvas, cellSize);

		eatingIndexArray.push(1);

		if (score % 3 === 0) {
			++level;
		}
	};
	const gotBonus = () => {
		if (bonus.active) {
			eatingIndexArray.push(1);
			++lives;
			bonusFlag = 0;
			bonus = setNewCoordinates(canvas, cellSize);
		}
	};

	const caughtFood = (head) => {
		let foods = [apple, bonus];
		let res = foods.find((food) => food.x === head.x && food.y === head.y);
		if (res === apple) {
			gotApple();
		} else {
			snake.pop();
			if (res === bonus) {
				gotBonus();
			}
		}
		isEating = eatingIndexArray.length > 0;
		rotten.active = level > 0 && level % 2 === 0;
		bonus.active = bonusFlag > 1;
	};

	const checkCollisions = (head) => {
		if (
			badPosition(snake, head, canvas) ||
			(collision(head)(rotten) && rotten.active)
		) {
			--lives;
			score -= 10;
			bonusFlag = 0;
			rotten = setNewCoordinates(canvas, cellSize);
			rotten.active = false;
			isEating = false;
			eatingIndexArray = [];
			if (lives >= 0) {
				respawn();
			} else {
				clearInterval(tongueInterval);
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
				tongue.y = head.y + cellSize;
				tongue.x = head.x + cellSize / 2;

				break;
			case "up":
				head.y -= cellSize;
				tongue.y = head.y;
				tongue.x = head.x + cellSize / 2;
				break;
			case "right":
				head.x += cellSize;
				tongue.x = head.x + cellSize;
				tongue.y = head.y + cellSize / 2;

				break;
			case "left":
				head.x -= cellSize;
				tongue.x = head.x;
				tongue.y = head.y + cellSize / 2;
				break;
			default:
				break;
		}
		mouthOpen =
			inVicinity(head, apple, cellSize) ||
			(bonus.active && inVicinity(head, bonus, cellSize));
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
