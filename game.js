const game_defaults = {
	direction: "left",
	height: 500,
	width: 400,
	score: 0,
	lives: 0,
	level: 1,
	highestscore: JSON.parse(localStorage.getItem("highestscore")) || 0,
	tongueOut: true,
	mouthOpen: false,
	gameOn: false,
	died: false,
	gameOver: false,
	bonusActive: false,
	eatenApple: null,
};
//create image, and argument as the image source
const createImage = (src) => {
	const image = new Image();
	image.src = src;
	return image;
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

const cellSize = 30;

const game = (options, canvas, ctx) => {
	canvas.width = options.width || game_defaults.width;
	canvas.height = options.height || game_defaults.height;
	let apple,
		bonus,
		snake,
		rotten,
		redBodyTimeout,
		tongueInterval,
		appleTimeout,
		bonusTimeout,
		bonusInterval,
		tongue,
		gameInterval,
		myData;

	const setNewCoordinates = () => {
		let randX =
			Math.floor(Math.random() * (canvas.width / cellSize - 2) + 1) * cellSize;
		let randY =
			Math.floor(Math.random() * (canvas.height / cellSize - 2) + 1) * cellSize;
		return { x: randX, y: randY };
	};
	const default_snake = [
		{
			x: Math.floor(canvas.width / (2 * cellSize)) * cellSize,
			y: Math.floor(canvas.height / (2 * cellSize)) * cellSize,
			isEating: false,
			direction: "left",
		},
	];

	const default_bonus = { ...setNewCoordinates(), countdown: 5, active: false };
	const default_apple = { ...setNewCoordinates(), active: true };
	const default_rotten = { ...setNewCoordinates(), active: false };
	//give randown x and y coordinates, withing canvas area

	//check if there is collision between 2 given cells
	const collision = (node) => (item) => node.x === item.x && node.y === item.y;

	//check if node is within canvas area
	const checkBounds = (node) => {
		let outXaxis = node.x < 0 || node.x > canvas.width;
		let outYaxis = node.y < 0 || node.y > canvas.height;
		return outXaxis || outYaxis;
	};

	//check if a cell/square is within a given distance of another cell/square
	const inVicinity = (node, item) => {
		let withinXaxis =
			node.x <= item.x + 2 * cellSize && node.x >= item.x - 2 * cellSize;
		let withinYaxis =
			node.y <= item.y + 2 * cellSize && node.y >= item.y - 2 * cellSize;
		return withinXaxis && withinYaxis;
	};

	//check if any segment of given array is colliding with specific square/cell
	const checkCollision = (arr, node) => {
		return arr.some(collision(node));
	};

	//check both if given cell is within canvas area or if it collides with a specific cell/
	const badPosition = (arr, node) => {
		return checkBounds(node) || checkCollision(arr.slice(1), node);
	};

	const init = () => {
		myData = { ...game_defaults, ...options };

		clearInterval(tongueInterval);
		clearInterval(bonusInterval);

		rotten = { ...default_rotten };
		apple = { ...default_apple };
		snake = [...default_snake];
		bonus = { ...default_bonus };
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
		myData.direction = snake[0].direction;
	};
	const stopBonusCountdown = () => {
		bonus.active = false;
		bonus = setNewCoordinates();
		// countdownWrapper.style.display = "none";
	};
	const updateCountDown = () => {
		clearTimeout(bonusTimeout);
		// countdownSpan.textContent = bonus.countdown;
		if (bonus.countdown === 0) {
			stopBonusCountdown();
		} else {
			bonus.countdown -= 1;
			bonusTimeout = setTimeout(updateCountDown, 1000);
		}
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
		if (!myData.mouthOpen && myData.tongueOut) {
			tongue = { x: snake[0].x, y: snake[0].y };
			let endX;
			let endY;

			//calculate begining tongue coordinates from head origin and add 1/2 cell for end coordinates
			if (snake[0].direction === "up") {
				tongue.x += cellSize / 2;
				endX = tongue.x;

				endY = tongue.y - cellSize / 2;
			} else if (snake[0].direction === "down") {
				tongue.x += cellSize / 2;
				endX = tongue.x;
				tongue.y += cellSize;
				endY = tongue.y + cellSize / 2;
			} else if (snake[0].direction === "left") {
				tongue.y += cellSize / 2;
				endY = tongue.y;

				endX = tongue.x - cellSize / 2;
			} else if (snake[0].direction === "right") {
				tongue.y += cellSize / 2;
				endY = tongue.y;
				tongue.x += cellSize;
				endX = tongue.x + cellSize / 2;
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
		// Get the pixel data of the image

		const imageData = ctx.getImageData(body.x, body.y, cellSize, cellSize);
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
		ctx.putImageData(imageData, body.x, body.y);
	};

	const drawSnake = () => {
		let snakeImage;
		let direction;

		snake.forEach((body, index) => {
			let isTail = index === snake.length - 1 && index > 0;
			direction = body.direction;
			if (index === 0) {
				snakeImage = myData.mouthOpen
					? openHead[direction]
					: snakeHead[direction];
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
			if (myData.died) {
				changeColor(body);
			}
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
	const updateHighScore = () => {
		localStorage.clear();
		localStorage.setItem("highestscore", JSON.stringify(highestscore));
	};
	const gotApple = () => {
		myData.eatenApple = apple;
		myData.score += 5;
		myData.speed -= 5;
		if (myData.score > myData.highestscore) {
			myData.highestscore = myData.score;
			updateHighScore();
		}

		apple = setNewCoordinates();

		snake[0].isEating = true;

		if (myData.score % 3 === 0) {
			++myData.level;
		}
	};

	//Bonus apples are activated at every 6 to 12 sec;
	const activateBonus = () => {
		if (!bonus.active) {
			bonus.active = true;
			bonus.countdown = 5;

			updateCountDown();
		}
	};

	const gotBonus = () => {
		if (bonus.active && bonus.countdown > 0) {
			clearTimeout(bonusTimeout);
			stopBonusCountdown();
			snake[0].isEating = true;
			++myData.lives;
		}
	};

	//check if snake caught food, if got apple, increment score and speed, if not, snake array pops.
	const checkFoodCollision = () => {
		let foods = [apple, bonus];
		let res = foods.find(
			(food) => food.x === snake[0].x && food.y === snake[0].y
		);
		if (res === apple) {
			gotApple();
		} else {
			snake.pop();
			if (res === bonus) {
				gotBonus();
			}
		}
		rotten.active = myData.level > 0 && myData.level % 2 === 0;
	};

	const checkBadCollisions = () => {
		if (
			badPosition(snake, snake[0]) ||
			(collision(snake[0])(rotten) && rotten.active)
		) {
			myData.died = true;
			--myData.lives;
			myData.score -= 10;
			myData.speed += 5;
			rotten = setNewCoordinates();
			rotten.active = false;
			snake.forEach((body) => (body.isEating = false));

			if (myData.lives >= 0) {
				clearTimeout(redBodyTimeout);
				redBodyTimeout = setTimeout(() => {
					myData.died = false;
				}, 1000);
				respawn();
			} else {
				myData.gameOver = true;
				stopGame();
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
		}
	};

	const moveSnake = () => {
		myData.eatenApple = null;
		let head = {
			x: snake[0].x,
			y: snake[0].y,
			direction: myData.direction,
			isEating: false,
		};

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

		snake.unshift(head);
		myData.mouthOpen =
			inVicinity(snake[0], apple) ||
			(bonus.active && inVicinity(snake[0], bonus));
	};

	const loop = () => {
		draw();
		moveSnake();
		checkBadCollisions();
		checkFoodCollision();
	};

	const getMyData = () => myData;
	const getBonus = () => bonus;

	const runGame = () => {
		myData.gameOn = true;
		tongueInterval = setInterval(
			() => (myData.tongueOut = !myData.tongueOut),
			1000
		);
		bonusInterval = setInterval(
			activateBonus,
			Math.floor(Math.random() * (13 - 6) + 6) * 1000
		);
		gameInterval = setInterval(loop, myData.speed);
	};
	const stopGame = () => {
		clearInterval(gameInterval);
		clearInterval(tongueInterval);
		clearInterval(bonusInterval);
		myData.gameOn = false;
	};
	return {
		init,
		handleKeyPressed,
		getMyData,
		loop,
		stopGame,
		runGame,
		getBonus,
	};
};
export default game;
