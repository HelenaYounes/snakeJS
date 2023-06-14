import {
	setNewCoordinates,
	updateDoc,
	collision,
	gameOver,
	badPosition,
} from "./controllers.js";
const game = () => {
	const canvas = document.getElementById("gameCanvas");
	const ctx = canvas.getContext("2d");
	const gridSize = 20;
	const initial_values = {
		speed: 200,
		canDrawChest: false,
		direction: "left",
		score: 0,
		lives: 0,
		apples: 0,
		highestscore: Number(localStorage.getItem("highestscore")) || 0,
	};
	let apple,
		chest,
		snake,
		speed,
		score,
		direction,
		canDrawChest,
		highestscore,
		lives,
		apples;

	const snakeBody = new Image();
	snakeBody.src = "body.png";
	const appleImg = new Image();
	appleImg.src = "apple.png";
	const chestImg = new Image();
	chestImg.src = "chest.png";

	const init = () => {
		apple = setNewCoordinates(canves, gridSize);
		snake = [setNewCoordinates(canves, gridSize)];
		chest = setNewCoordinates(canves, gridSize);
		speed = initial_values.speed;
		lives = initial_values.lives;
		highestscore = initial_values.highestscore;
		canDrawChest = initial_values.canDrawChest;
		apples = initial_values.apples;
		direction = initial_values.direction;
		score = initial_values.score;
	};
	const respawn = () => {
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
	const checkGameOver = () => {
		snake.pop();
		lives === 0 ? gameOver() : respawn();
	};
	const increaseScore = () => {
		canDrawChest = apples > 2;
		apples += 1;
		newScore = score + 10;
		updateDoc("score", score);

		if (newScore > highestscore) {
			highestscore = newScore;
			updateDoc("highestscore", highestscore);
		}
		apple = setNewCoordinates();
	};

	const increaseChest = () => {
		lives += 1;
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
		if (badPosition(head, snake)) {
			checkGameOver();
		}
		if (collision(head)(apple)) {
			increaseScore();
		}
		if (collision(head)(chest) && canDrawChest) {
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
		if (!head) {
			debugger;
		}
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
		init,
		draw,
		moveSnake,
		updateSnake,
	};
};
export default game;
