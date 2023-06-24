import {
	setNewCoordinates,
	collision,
	badPosition,
	inVicinity,
	createImage,
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
	up: createImage("./assets/head_up.png"),
	down: createImage("./assets/head_down.png"),
	left: createImage("./assets/head_left.png"),
	right: createImage("./assets/head_right.png"),
};
const openHead = {
	up: createImage("./assets/openup.png"),
	down: createImage("./assets/opendown.png"),
	left: createImage("./assets/openleft.png"),
	right: createImage("./assets/openright.png"),
};

const snakeTail = {
	up: createImage("./assets/tail_up.png"),
	down: createImage("./assets/tail_down.png"),
	left: createImage("./assets/tail_left.png"),
	right: createImage("./assets/tail_right.png"),
};

const snakeBody = {
	up: createImage("./assets/body_vertical.png"),
	down: createImage("./assets/body_vertical.png"),
	right: createImage("./assets/body_horizontal.png"),
	left: createImage("./assets/body_horizontal.png"),
	rightdown: createImage("./assets/body_curve_bottomleft.png"),
	upleft: createImage("./assets/body_curve_bottomleft.png"),
	rightup: createImage("./assets/body_curve_topleft.png"),
	downleft: createImage("./assets/body_curve_topleft.png"),
	downright: createImage("./assets/body_curve_topright.png"),
	leftup: createImage("./assets/body_curve_topright.png"),
	upright: createImage("./assets/body_curve_bottomright.png"),
	leftdown: createImage("./assets/body_curve_bottomright.png"),
};

const appleThroat = {
	up: createImage("./assets/apple_throat_up_down.jpg"),
	down: createImage("./assets/apple_throat_up_down.jpg"),
	right: createImage("./assets/apple_throat_left_right.jpg"),
	left: createImage("./assets/apple_throat_left_right.jpg"),
};

const appleImg = createImage("./assets/apple.png");
const bonusImg = createImage("./assets/bonus.png");
const rottenImg = createImage("./assets/rotten.png");

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
		score,
		lives,
		level,
		speed,
		mouthOpen,
		tongueOut,
		tongueInterval,
		tongue;

	const myData = { ...game_defaults, ...options };
	let { cellSize, width, height } = myData;

	const moveTongue = () => {
		tongueOut = !tongueOut;
	};
	const init = () => {
		clearInterval(tongueInterval);
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
		snake = [
			{
				x: Math.floor(canvas.width / (2 * cellSize)) * cellSize,
				y: Math.floor(canvas.height / (2 * cellSize)) * cellSize,
			},
		];
		snake[0].direction = myData.direction;
		bonus = setNewCoordinates(canvas, cellSize);
		bonus.active = false;
		snake[0].isEating = true;
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

	//draw red tongue that goes in and out of snake mouth when not in vicinity of food'
	const drawTongue = () => {
		if (!mouthOpen && tongueOut) {
			ctx.strokeStyle = "red";
			ctx.lineWidth = 4;

			ctx.beginPath(); // Start a new path
			ctx.moveTo(tongue.x, tongue.y);
			let endX = tongue.x;
			let endY = tongue.y;

			if (snake[0].direction === "up") {
				endY = tongue.y - cellSize / 2;
			} else if (snake[0].direction === "down") {
				endY = tongue.y + cellSize / 2;
			} else if (snake[0].direction === "left") {
				endX = tongue.x - cellSize / 2;
			} else if (snake[0].direction === "right") {
				endX = tongue.x + cellSize / 2;
			}
			ctx.lineTo(endX, endY);
			ctx.stroke();
		}
	};

	const drawSnake = () => {
		let snakeImage;
		let direction;

		snake.forEach((body, index) => {
			let isTail = index === snake.length - 1 && index > 0;
			direction = body.direction;
			if (index === 0) {
				snakeImage = mouthOpen ? openHead[direction] : snakeHead[direction];
			} else {
				let segAhead = snake[index - 1];
				if (direction !== segAhead.direction) {
					direction = `${body.direction}${segAhead.direction}`;
					body.isEating = false;
				}

				snakeImage = isTail
					? snakeTail[segAhead.direction]
					: body.isEating
					? appleThroat[direction]
					: snakeBody[direction];
			}

			ctx.drawImage(snakeImage, body.x, body.y, cellSize, cellSize);
		});
	};

	const draw = () => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawTongue();
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

		snake[0].isEating = true;

		if (score % 3 === 0) {
			++level;
		}
	};
	const gotBonus = () => {
		if (bonus.active) {
			snake[0].isEating = true;
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
			snake.forEach((body) => (body.isEating = false));

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
		let head = {
			x: snake[0].x,
			y: snake[0].y,
			direction: myData.direction,
			isEating: false,
		};

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
