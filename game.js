import {
	snakeBody,
	snakeHead,
	snakeTail,
	appleThroat,
	appleImg,
	bonusImg,
	rottenImg,
	keyEvent,
	openHead,
	cellSize,
} from "./constants.js";

import {
	collision,
	inVicinity,
	badPosition,
	setNewCoordinates,
	foodPerimeter,
} from "./utils.js";

//do I keep score , level ... in object, or can i set up as single vars
const game_defaults = {
	direction: "left",
	height: 500,
	width: 400,
	score: 0,
	lives: 0,
	level: 1,
	tongueOut: true,
	mouthOpen: false,
	gameOn: false,
	crashed: false,
	eatenApple: null,
};

const game = (options, elements) => {
	const {
		canvas,
		startPauseDiv,
		scoreSpan,
		countdownWrapper,
		countdownSpan,
		gameoverDiv,
		canvasDiv,
		scoreDiv,
		levelDiv,
		livesDiv,
		highestScoreDiv,
	} = elements;

	const ctx = canvas.getContext("2d");
	let highScr = JSON.parse(localStorage.getItem("highestscore")) || 0;

	let animation,
		apple,
		bonus,
		snake,
		rotten,
		tongueInterval,
		bonusTimeout,
		bonusInterval,
		rottenInterval,
		newGame,
		loopInterval,
		gameState,
		appleTimeout;

	const init = () => {
		gameState = { ...game_defaults, ...options };
		canvas.width = gameState.width;
		canvas.height = gameState.height;
		newGame = true;
		snake = [
			{
				x: Math.floor(canvas.width / (2 * cellSize)) * cellSize,
				y: Math.floor(canvas.height / (2 * cellSize)) * cellSize,
				isEating: false,
				direction: "left",
				active: true,
			},
		];
		bonus = {
			...setNewCoordinates(canvas, cellSize),
			countdown: 5,
			active: false,
			img: bonusImg,
		};
		apple = {
			...setNewCoordinates(canvas, cellSize),
			active: true,
			img: appleImg,
		};
		rotten = {
			...setNewCoordinates(canvas, cellSize),
			active: false,
			img: rottenImg,
		};
		animation = true;
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
		gameState.direction = snake[0].direction;
	};
	const stopBonusCountdown = () => {
		bonus.active = false;
		bonus = { ...bonus, ...setNewCoordinates(canvas, cellSize) };
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

	const getTongueCoordinates = (cellSize) => {
		let tongue = {
			x: snake[0].x,
			y: snake[0].y,
			endX: snake[0].x,
			endY: snake[0].y,
			active: !gameState.mouthOpen && gameState.tongueOut,
		};

		//calculate begining tongue coordinates from head origin and add 1/2 cell for end coordinates
		if (snake[0].direction === "up") {
			tongue.x += cellSize / 2;
			tongue.endX = tongue.x;

			tongue.endY = tongue.y - cellSize / 2;
		} else if (snake[0].direction === "down") {
			tongue.x += cellSize / 2;
			tongue.endX = tongue.x;
			tongue.y += cellSize;
			tongue.endY = tongue.y + cellSize / 2;
		} else if (snake[0].direction === "left") {
			tongue.y += cellSize / 2;
			tongue.endY = tongue.y;

			tongue.endX = tongue.x - cellSize / 2;
		} else if (snake[0].direction === "right") {
			tongue.y += cellSize / 2;
			tongue.endY = tongue.y;
			tongue.x += cellSize;
			tongue.endX = tongue.x + cellSize / 2;
		}
		return tongue;
	};

	//draw red tongue that goes in and out of snake mouth when not in vicinity of food'
	const drawTongue = (ctx, cellSize) => {
		let { x, y, endX, endY, active } = getTongueCoordinates(cellSize);
		if (active) {
			ctx.strokeStyle = "red";
			ctx.lineWidth = 4;

			ctx.beginPath(); // Start a new path
			ctx.moveTo(x, y);
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
				snakeImage = gameState.mouthOpen
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
			if (gameState.crashed) {
				changeColor(body);
				gameState.crashed = false;
			}
		});
	};

	const drawFoods = (ctx, cellSize, ...items) => {
		items.forEach((el) => {
			if (el.active) {
				ctx.drawImage(el.img, el.x, el.y, cellSize, cellSize);
			}
		});
	};
	const draw = () => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawTongue(ctx, cellSize);
		drawFoods(ctx, cellSize, rotten, apple, bonus);
		drawSnake(ctx, cellSize);
	};

	const gotApple = () => {
		gameState.eatenApple = apple;
		gameState.score += 5;
		gameState.speed -= 5;

		apple = { ...apple, ...setNewCoordinates(canvas, cellSize) };

		snake[0].isEating = true;

		if (gameState.score % 3 === 0) {
			++gameState.level;
		}
	};

	const appleAnimation = (apple) => {
		if (animation) {
			animation = false;
			clearTimeout(appleTimeout);
			//add apple animation

			// Animate the apple jump
			const appleElement = document.createElement("div");
			appleElement.classList.add("jump-animation");
			appleElement.innerText = "+5";
			document.body.appendChild(appleElement);

			// Calculate the position of the score span
			const scoreRect = scoreSpan.getBoundingClientRect();
			const scoreX = scoreRect.left + scoreRect.width / 2;
			const scoreY = scoreRect.top + scoreRect.height / 2;

			// Calculate the position of the canvas
			const canvasRect = canvas.getBoundingClientRect();
			const canvasX = canvasRect.left + apple.x;
			const canvasY = canvasRect.top + apple.y;

			// Animate the apple jump from the canvas to the score span
			appleElement.style.left = canvasX + "px";
			appleElement.style.top = canvasY + "px";
			appleElement.style.transition = "all 1s";

			requestAnimationFrame(() => {
				appleElement.style.left = scoreX + "px";
				appleElement.style.top = scoreY + "px";
				appleElement.style.opacity = "0";
			});

			// Remove the apple element after the animation finishes
			appleTimeout = setTimeout(() => {
				appleElement.remove();
				animation = true;
			}, 2000);
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
			++gameState.lives;
		}
	};
	const loseLife = () => {
		gameState.crashed = true;
		--gameState.lives;
		gameState.score -= 10;
		gameState.speed += 5;
		rotten = {
			...setNewCoordinates(canvas, cellSize),
			active: false,
		};

		snake.forEach((body) => (body.isEating = false));
	};

	const kill = () => {
		clearInterval(tongueInterval);
		clearInterval(bonusInterval);
		clearInterval(rottenInterval);
		clearInterval(loopInterval);
		clearTimeout(appleTimeout);
		clearTimeout(bonusTimeout);
		init();
		restartDivs();
	};
	const gameover = () => {
		gameoverDiv.style.opacity = "1";
		kill();
	};

	const checkCollisions = () => {
		if (collision(snake[0])(apple)) {
			gotApple();
		} else {
			snake.pop();
			if (badPosition([...snake, rotten], snake[0], canvas)) {
				loseLife();
			} else if (collision(snake[0])(bonus)) {
				gotBonus();
			}
		}
	};

	const handleKeyPressed = (e) => {
		let newDirection = keyEvent[e.key];

		let opposite =
			newDirection === gameState.direction ||
			`${newDirection}:${gameState.direction}` === "up:down" ||
			`${newDirection}:${gameState.direction}` === "down:up" ||
			`${newDirection}:${gameState.direction}` === "left:right" ||
			`${newDirection}:${gameState.direction}` === "right:left";
		if (
			!opposite &&
			(newDirection === "left" ||
				newDirection === "right" ||
				newDirection === "down" ||
				newDirection === "up")
		) {
			gameState.direction = newDirection;
		}
	};

	//maybe add x and y perimeter in ead obj that is 2 cellsize ahead, to check collision with vivinity of item
	const moveSnake = () => {
		gameState.eatenApple = null;
		let head = {
			x: snake[0].x,
			y: snake[0].y,
			direction: gameState.direction,
			isEating: false,
			active: true,
		};

		switch (gameState.direction) {
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
		gameState.mouthOpen = foodPerimeter(
			snake[0],
			cellSize,
			bonus,
			apple,
			rotten
		);
	};

	const loop = () => {
		draw();
		moveSnake();
		checkCollisions();

		// checkBadCollisions();
		// checkFoodCollision();
		updateGame();
	};

	const runGame = () => {
		gameState.gameOn = true;
		tongueInterval = setInterval(
			() => (gameState.tongueOut = !gameState.tongueOut),
			1000
		);
		bonusInterval = setInterval(
			activateBonus,
			Math.floor(Math.random() * (13 - 6) + 6) * 1000
		);
		rottenInterval = setInterval(() => {
			rotten.active = true;
		}, Math.floor(Math.random() * (17 - 6) + 6) * 1000);

		loopInterval = setInterval(loop, gameState.speed);
	};
	const stopGame = () => {
		clearInterval(loopInterval);
		clearInterval(tongueInterval);
		clearInterval(bonusInterval);
		clearInterval(rottenInterval);
		gameState.gameOn = false;
	};

	const updateGame = () => {
		if (gameState.score > highScr) {
			highScr = gameState.score;
			localStorage.clear();
			localStorage.setItem("highestscore", JSON.stringify(highScr));
		}
		countdownWrapper.style.display = bonus.active ? "block" : "none";
		countdownSpan.textContent = bonus.countdown;
		highestScoreDiv.textContent = highScr;
		scoreDiv.textContent = gameState.score;
		livesDiv.textContent = gameState.lives;
		levelDiv.textContent = gameState.level;

		if (!!gameState.eatenApple) {
			appleAnimation(gameState.eatenApple);
		} else if (gameState.crashed) {
			gameState.crashed = false;
			if (gameState.lives < 0) {
				gameover();
			} else respawn();
		}
	};

	const gameStateHandler = () => {
		if (newGame) {
			canvasDiv.style.backgroundImage = 'url("./assets/snakeBackground.jpeg")';
			newGame = false;
		}
		gameState.gameOn ? pause() : start();
	};

	const start = () => {
		startPauseDiv.textContent = "PAUSE";
		runGame();
	};
	const pause = () => {
		startPauseDiv.textContent = "RESUME";
		stopGame();
	};

	const restartDivs = () => {
		countdownWrapper.style.display = "none";
		gameoverDiv.style.opacity = "0";
		startPauseDiv.textContent = "NEW GAME";

		highestScoreDiv.textContent = highScr;
		scoreDiv.textContent = gameState.score;
		livesDiv.textContent = gameState.lives;
		levelDiv.textContent = gameState.level;
	};

	startPauseDiv.addEventListener("click", gameStateHandler);
	document.addEventListener("keydown", handleKeyPressed);
	return {
		init,
		handleKeyPressed,
		loop,
		stopGame,
		runGame,
	};
};
export default game;
