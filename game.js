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
	badPosition,
	setNewCoordinates,
	foodPerimeter,
} from "./utils.js";

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
	collision: "",
	crashed: false,
	eatenApple: null,
};

const game = (options, elements) => {
	const {
		canvas,
		startButton,
		countdownWrapper,
		countdownSpan,
		gameoverSpan,
		scoreSpan,
		levelSpan,
		livesSpan,
		highestScoreSpan,
	} = elements;

	const ctx = canvas.getContext("2d");
	let highScr = JSON.parse(localStorage.getItem("highestscore")) || 0;

	let animation,
		apple,
		bonus,
		snake,
		newGame,
		rotten,
		gameState,
		intervalTimeoutIds;

	const initState = () => {
		gameState = { ...game_defaults, ...options };
		intervalTimeoutIds = {
			loop: null,
			bonus: null,
			rotten: null,
			tongue: null,
			bonusTimeout: null,
			resetTimeout: null,
			appleTimeout: null,
		};
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
	const tongueToggle = () => {
		gameState.tongueOut = !gameState.tongueOut;
	};

	const activateRotten = () => {
		if (!rotten.active) {
			rotten.active = true;
		}
	};

	const startIntervals = () => {
		intervalTimeoutIds.tongue = setInterval(tongueToggle, 1000);
		intervalTimeoutIds.bonus = setInterval(
			activateBonus,
			Math.floor(Math.random() * (13 - 6) + 6) * 1000
		);
		intervalTimeoutIds.rotten = setInterval(
			activateRotten,
			Math.floor(Math.random() * (17 - 6) + 6) * 1000
		);
	};

	//restart snake in middle of canvas.
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
	};
	const updateCountDown = () => {
		clearTimeout(intervalTimeoutIds.bonusTimeout);
		if (bonus.countdown === 0) {
			stopBonusCountdown();
		} else {
			bonus.countdown -= 1;
			intervalTimeoutIds.bonusTimeout = setTimeout(updateCountDown, 1000);
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

		//set tongue coordinates to originate from middle of snake's head,
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

	//draw red tongue that goes in and out when not in vicinity of foods
	const drawTongue = (ctx, cellSize) => {
		let { x, y, endX, endY, active } = getTongueCoordinates(cellSize);
		if (active) {
			ctx.strokeStyle = "red";
			ctx.lineWidth = 4;

			ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.lineTo(endX, endY);
			ctx.stroke();
		}
	};
	const changeColor = (body) => {
		// Get the pixel data of image

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
		let isTail;
		snake.forEach((body, index) => {
			isTail = index === snake.length - 1 && index > 0;
			direction = body.direction;
			if (index === 0) {
				snakeImage = gameState.mouthOpen
					? openHead[direction]
					: snakeHead[direction];
			} else {
				//if change of direction (on key pressed), concatenate new direction to previous one to get curved body
				//snake array is unshifted, previous segment is upper body
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
			//draw red snake when died
			if (gameState.crashed) {
				changeColor(body);
				gameState.crashed = false;
			}
		});
	};

	//draw apples on canvas when are their active attribute is true.
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

	const catchApple = () => {
		//get coordinates of eaten apple to start animation before resetting coordinates
		appleAnimation(apple);
		gameState.score += 5;
		gameState.speed -= 5;
		snake[0].isEating = true;

		apple = { ...apple, ...setNewCoordinates(canvas, cellSize) };

		if (gameState.score % 3 === 0) {
			++gameState.level;
		}
	};

	//when apple is caughe, jump from canvas to score div, show +5 increment
	const appleAnimation = (apple) => {
		if (animation) {
			animation = false;
			clearTimeout(intervalTimeoutIds.appleTimeout);

			// jump
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

			// Animate the apple jumping from the canvas to the score span
			appleElement.style.left = canvasX + "px";
			appleElement.style.top = canvasY + "px";
			appleElement.style.transition = "all 1s";

			requestAnimationFrame(() => {
				appleElement.style.left = scoreX + "px";
				appleElement.style.top = scoreY + "px";
				appleElement.style.opacity = "0";
			});

			// Remove the apple element after the animation finishes
			intervalTimeoutIds.appleTimeout = setTimeout(() => {
				appleElement.remove();
				animation = true;
			}, 2000);
		}
	};

	//Bonus apples are activated every 6 to 12 sec;
	const activateBonus = () => {
		if (!bonus.active) {
			bonus.active = true;
			bonus.countdown = 5;
			updateCountDown();
		}
	};

	const ateBonus = () => {
		if (bonus.active && bonus.countdown > 0) {
			clearTimeout(intervalTimeoutIds.bonusTimeout);
			stopBonusCountdown();
			snake[0].isEating = true;
			++gameState.lives;
		}
	};
	const loseGame = () => {
		stopGame();
		if (gameState.lives < 1) {
			gameover();
		} else {
			gameState.crashed = true;
			--gameState.lives;
			gameState.score -= 10;
			gameState.speed += 5;
			rotten = {
				...setNewCoordinates(canvas, cellSize),
				active: false,
			};

			snake.forEach((body) => (body.isEating = false));
			respawn();
		}
	};

	const gameover = () => {
		gameoverSpan.style.opacity = "1";

		intervalTimeoutIds.resetTimeout = setTimeout(initGame, 2000);
	};

	const checkCollisions = () => {
		let action;
		if (collision(snake[0])(apple)) {
			action = "apple";
		} else {
			snake.pop();
			if (badPosition([...snake, rotten], snake[0], canvas)) {
				action = "loseGame";
			} else if (collision(snake[0])(bonus)) {
				action = "bonus";
			}
		}
		return action;
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

	const updateGame = {
		apple: catchApple,
		rotten: loseGame,
		bonus: ateBonus,
		loseGame: loseGame,
	};

	const loop = () => {
		draw();
		moveSnake();
		if (!!checkCollisions()) {
			updateGame[checkCollisions()]();
			updateHighScore();
			updateHTML();
		}
	};
	const clearTimeoutInterval = () => {
		for (let key in intervalTimeoutIds) {
			clearInterval(intervalTimeoutIds[key]);
			clearTimeout(intervalTimeoutIds[key]);
		}
	};
	const runGame = () => {
		gameState.gameOn = true;
		newGame = false;
		startIntervals();
		intervalTimeoutIds.loop = setInterval(loop, gameState.speed);
	};
	const stopGame = () => {
		clearTimeoutInterval();
		gameState.gameOn = false;
	};

	const updateHighScore = () => {
		if (gameState.score > highScr) {
			highScr = gameState.score;
			localStorage.clear();
			localStorage.setItem("highestscore", JSON.stringify(highScr));
		}
	};

	const updateHTML = () => {
		countdownWrapper.style.display = bonus.active ? "block" : "none";
		countdownSpan.textContent = bonus.countdown;
		gameoverSpan.style.opacity = "0";
		startButton.textContent = newGame
			? "START"
			: gameState.gameOn
			? "PAUSE"
			: "RESUME";
		highestScoreSpan.textContent = highScr;
		scoreSpan.textContent = gameState.score;
		livesSpan.textContent = gameState.lives;
		levelSpan.textContent = gameState.level;
	};

	const initGame = () => {
		clearTimeoutInterval();
		initState();
		updateHTML();
	};
	const gameStateHandler = () => {
		updateHTML();
		gameState.gameOn ? stopGame() : runGame();
	};

	startButton.addEventListener("click", gameStateHandler);
	document.addEventListener("keydown", handleKeyPressed);
	return {
		initGame,
		handleKeyPressed,
		loop,
		stopGame,
		runGame,
	};
};
export default game;
