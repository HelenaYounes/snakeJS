import {
	canvas,
	ctx,
	center,
	cellSize,
	countdownSpan,
	countdownWrapper,
	snakeBody,
	snakeHead,
	snakeTail,
	appleThroat,
	keyEvent,
	setNewCoordinates,
	collision,
	badPosition,
	inVicinity,
	openHead,
	default_params,
	animations,
	foods,
} from "./controllers.js";

const game = (options) => {
	let mouthOpen,
		tongueOut,
		tongueInterval,
		bonusTimeout,
		collisionTimeout,
		died,
		appleTimeout,
		bonusCountdown,
		bonusInterval,
		score,
		lives,
		level,
		snake;
	let params = { ...default_params, ...options };
	let { width, height, speed } = params;
	let { apple, rotten, bonus } = foods;
	canvas.width = width;
	canvas.height = height;

	const startIntervals = () => {
		clearInterval(tongueInterval);
		clearInterval(bonusInterval);
		tongueInterval = setInterval(() => {
			tongueOut = !tongueOut;
		}, 1000);
		bonusInterval = setInterval(
			activateBonus,
			Math.floor(Math.random() * (13 - 6) + 6) * 1000
		);
	};

	const init = () => {
		params = { ...default_params, ...options };
		({ width, height } = params);
		({ apple, rotten, bonus } = foods);
		[apple, rotten, bonus].forEach((el) => {
			el = { ...el, ...setNewCoordinates(canvas) };
		});
		countdownWrapper.style.display = "none";
		bonusCountdown = 5;
		snake = [
			{
				x: center(width),
				y: center(height),
				isEating: false,
				direction: params.direction,
			},
		];
		lives = 0;
		score = 0;
		level = 1;
		// tongue = { x: snake[0].x, y: snake[0].y };
		died = false;
		mouthOpen = false;
		tongueOut = true;
		startIntervals();
	};

	const respawn = () => {
		clearTimeout(collisionTimeout);
		let dx = snake[0].x - center(width);
		let dy = snake[0].y - center(height);

		snake.forEach((body) => {
			body.x = body.x - dx;
			body.y = body.y - dy;
		});
		params.direction = snake[0].direction;
		died = false;
		startIntervals();
	};
	const stopBonusCountdown = () => {
		bonus.active = false;
		bonus = { ...bonus, ...setNewCoordinates(canvas) };
		countdownWrapper.style.display = "none";
	};
	const updateCountDown = () => {
		clearTimeout(bonusTimeout);
		countdownSpan.textContent = bonusCountdown;
		if (bonusCountdown === 0) {
			stopBonusCountdown();
		} else {
			bonusCountdown--;
			bonusTimeout = setTimeout(updateCountDown, 1000);
		}
	};

	const drawFoods = (...args) => {
		args.forEach(({ x, y, img, active }) => {
			if (active) {
				ctx.drawImage(img, x, y, cellSize, cellSize);
			}
		});
	};

	//draw red tongue that goes in and out of snake mouth when not in vicinity of food'
	const drawTongue = () => {
		if (!mouthOpen && tongueOut) {
			let tongue = { x: snake[0].x, y: snake[0].y };
			let endX;
			let endY;
			let half = cellSize / 2;
			//calculate begining tongue coordinates from head origin and add 1/2 cell for end coordinates
			switch (snake[0].direction) {
				case "up": {
					tongue.x += cellSize / 2;
					// tongue.y -= cellSize;
					endX = tongue.x;
					endY = tongue.y - cellSize / 2;
					break;
				}
				case "down": {
					tongue.x += cellSize / 2;
					endX = tongue.x;
					tongue.y += cellSize;
					endY = tongue.y + cellSize / 2;
					break;
				}
				case "left": {
					// tongue.x -= cellSize;
					tongue.y += cellSize / 2;
					endY = tongue.y;
					endX = tongue.x - cellSize / 2;
					break;
				}
				case "right": {
					tongue.y += cellSize / 2;
					endY = tongue.y;
					tongue.x += cellSize;
					endX = tongue.x + cellSize / 2;
					break;
				}
			}

			ctx.strokeStyle = "red";
			ctx.lineWidth = 4;

			ctx.beginPath(); // Start a new path
			ctx.moveTo(tongue.x, tongue.y);
			ctx.lineTo(endX, endY);
			ctx.stroke();
		}
	};
	const changeColor = (body) => {
		let { x, y } = body;
		// Get the pixel data of the image

		const imageData = ctx.getImageData(x, y, cellSize, cellSize);
		const data = imageData.data;

		// Loop through each pixel and modify its color
		for (let i = 0; i < data.length; i += 4) {
			// Modify the RGB values of each pixel
			// For example, set the red component to 255 (maximum value) to change it to red
			data[i] = 255; // Red component
			data[i + 1] = 0; // Green component
			data[i + 2] = 0; // Blue component
			// The fourth component is the alpha channel (transparency), so it's left unchanged
		}

		// Put the modified pixel data back onto the canvas
		ctx.putImageData(imageData, x, y);
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
				//if change of direction (on key pressed), concatenate new direction to previous one to get curved body
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
			if (died) {
				changeColor(body);
			}
		});
	};

	const draw = () => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawTongue();
		drawFoods(bonus, apple, rotten);
		drawSnake();
	};
	const appleAnimation = () => {
		return animations(apple, appleTimeout);
	};

	const gotApple = () => {
		clearTimeout(appleTimeout);
		appleAnimation();

		apple = { ...apple, ...setNewCoordinates(canvas) };
		snake[0].isEating = true;
		score += 5;
		speed -= 5;

		//add apple animation

		// Animate the apple jump

		if (score % 3 === 0) {
			++level;
		}
	};

	//Bonus apples are activated at every 6 to 12 sec;
	const activateBonus = () => {
		if (!bonus.active) {
			bonus.active = true;
			bonusCountdown = 5;
			countdownWrapper.style.display = "block";
			updateCountDown();
		}
	};

	const gotBonus = () => {
		if (bonus.active && bonusCountdown > 0) {
			clearTimeout(bonusTimeout);
			stopBonusCountdown();
			snake[0].isEating = true;
			++lives;
		}
	};

	//check if snake caught food, if got apple, increment score and speed, if not, snake array pops.
	const caughtFood = (head) => {
		let foodss = [apple, bonus];
		let res = foodss.find((food) => food.x === head.x && food.y === head.y);
		if (res === apple) {
			gotApple();
		} else {
			snake.pop();
			if (res === bonus) {
				gotBonus();
			}
		}
		rotten.active = level > 0 && level % 2 === 0;
	};

	const checkCollisions = (head) => {
		if (
			badPosition(snake, head, canvas) ||
			(collision(head)(rotten) && rotten.active)
		) {
			died = true;
			--lives;
			score -= 10;

			speed += 5;
			rotten = { ...rotten, ...setNewCoordinates(canvas) };
			rotten.active = false;
			snake.forEach((body) => (body.isEating = false));
			clearInterval(tongueInterval);
			clearInterval(bonusInterval);

			if (lives >= 0) {
				//pause snake movement and reposition snake after 1 sec
				params.direction = "stop";
				collisionTimeout = setTimeout(respawn, 1000);
			} else {
			}
		} else {
			snake.unshift(head);
			caughtFood(head);
		}
	};

	const handleKeyPressed = (e) => {
		let newDirection = keyEvent[e.key];
		let opposite =
			newDirection === params.direction ||
			`${newDirection}:${params.direction}` === "up:down" ||
			`${newDirection}:${params.direction}` === "down:up" ||
			`${newDirection}:${params.direction}` === "left:right" ||
			`${newDirection}:${params.direction}` === "right:left";
		if (
			!opposite &&
			(newDirection === "left" ||
				newDirection === "right" ||
				newDirection === "down" ||
				newDirection === "up")
		) {
			params.direction = newDirection;
		}
	};

	const moveSnake = () => {
		let head = {
			x: snake[0].x,
			y: snake[0].y,
			direction: params.direction,
			isEating: false,
		};

		switch (params.direction) {
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
				return;
		}
		mouthOpen =
			inVicinity(head, cellSize, apple) ||
			(bonus.active && inVicinity(head, cellSize, bonus));
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
