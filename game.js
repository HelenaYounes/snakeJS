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
const game = (options) => {
	let apple, bonus, snake, bonusFlag, score, lives, updatedValue;
	const myData = { ...game_defaults, ...options };
	let { gridSize, direction, width, height } = myData;

	const snakeBody = new Image();
	const appleImg = new Image();
	const bonusImg = new Image();

	const init = () => {
		snakeBody.src = options.snakeSrc || "body.png";
		appleImg.src = options.appleSrc || "apple.png";
		bonusImg.src = options.bonusSrc || "bonus.png";
		canvas.width = width;
		canvas.height = height;
		bonusFlag = 0;
		score = 0;
		lives = 0;
		updatedValue = false;
		apple = setNewCoordinates(canvas, gridSize);
		snake = [setNewCoordinates(canvas, gridSize)];
		bonus = setNewCoordinates(canvas, gridSize);
	};

	const getMyData = (str) => myData[str];

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

	const drawBonus = () => {
		if (bonusFlag > 2) {
			ctx.drawImage(bonusImg, bonus.x, bonus.y);
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
		drawBonus();
		drawSnake();
	};

	const updateSnake = (head, canvas, gridSize) => {
		if (collision(head)(apple)) {
			++score;
			++bonusFlag;
			apple = setNewCoordinates(canvas, gridSize);
		} else {
			snake.pop();
			if (badPosition([...snake].slice(1), head, canvas)) {
				bonusFlag = 0;
				--lives;
				if (lives >= 0) {
					respawn();
				}
			} else if (collision(head)(bonus)) {
				++lives;
				bonusFlag = 0;
				bonus = setNewCoordinates(canvas, gridSize);
			}
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
		}
		myData["direction"] = direction;
	};

	const moveSnake = () => {
		let head = snake[0];
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
		updateSnake(head, canvas, gridSize);
	};

	const getScore = () => score;
	const getLives = () => lives;
	return {
		init,
		handleKeyPressed,
		draw,
		moveSnake,
		getMyData,
		getScore,
		getLives,
		respawn,
	};
};
export default game;
