import {
	setNewCoordinates,
	collision,
	badPosition,
	increase,
	decrease,
	reset,
} from "./controllers.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const game_defaults = {
	direction: "left",
	height: 500,
	width: 400,
	apples: 0,
	score: 0,
	lives: 0,
	bonusFlag: 0,
	gridSize: 20,
};
const snakeBody = new Image();
snakeBody.src = "body.png";
const appleImg = new Image();
appleImg.src = "apple.png";
const bonusImg = new Image();
bonusImg.src = "bonus.png";

const game = (options) => {
	let apple, bonus, snake;
	let myData = { ...game_defaults, ...options };
	let { direction, height, width, apples, score, lives, bonusFlag, gridSize } =
		myData;
	const init = () => {
		canvas.width = width;
		canvas.height = height;
		// bonusFlag = 0;
		// score = 0;
		// lives = 0;
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
		if (myData["bonusFlag"] > 2) {
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
			increase(myData, "score", "apples", "bonusFlag");
			updateDivs("score");
			apple = setNewCoordinates(canvas, gridSize);
		} else {
			snake.pop();
			if (badPosition([...snake].slice(1), head, canvas)) {
				decrease(myData, "lives");
				reset(myData)("bonusFlag");
				updateDivs("lives");
			} else if (collision(head)(bonus)) {
				increase(myData, "lives");
				reset(myData)("bonusFlag");
				updateDivs("lives");
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

	const updateDivs = (...ids) => {
		let div;
		let value;
		for (let id of ids) {
			div = document.getElementById(id);
			value = myData[id];
			div.textContent = `${value}`;
		}
	};

	const updateHighScore = (div, val) => {
		let score = myData["score"];
		if (score > val) {
			div.textContent = `${score}`;
			localStorage.clear();
			localStorage.setItem("highestscore", JSON.stringify(score));
			val = score;
		}
		return val;
	};

	const getDataObject = () => myData;
	return {
		init,
		handleKeyPressed,
		draw,
		moveSnake,
		getMyData,
		getDataObject,
		updateDivs,
		updateHighScore,
		myData,
	};
};
export default game;
