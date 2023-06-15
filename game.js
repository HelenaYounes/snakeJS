import {
	// canvas,
	// ctx,
	// gridSize,
	get,
	setNewCoordinates,
	collision,
	badPosition,
} from "./controllers.js";
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gridSize = 20;

const game_defaults = {
	canDrawChest: false,
	direction: "left",
	apples: 0,
	"score": "0",
	lives: 0,
};
const snakeBody = new Image();
snakeBody.src = "body.png";
const appleImg = new Image();
appleImg.src = "apple.png";
const chestImg = new Image();
chestImg.src = "chest.png";

const game = (options) => {
	// options
	// grid dimensions (200 x 200)

	//

	let apple, chest, snake;
	let myData = { ...game_defaults, ...options };

	let { apples, canDrawChest, "score", "lives", direction } = myData;

	const init = () => {
		canvas.width = options.width;
		canvas.height = options.height;
		myData = { ...game_defaults, ...options };
		apple = setNewCoordinates(canvas, gridSize);
		snake = [setNewCoordinates(canvas, gridSize)];
		chest = setNewCoordinates(canvas, gridSize);
	};
	const getUpdate = (obj) => (propName) => obj[propName];
	let getMyData = getUpdate(myData);

	const updatePropertyValues = (obj) => (delta) => {
		return (...propertyNames) => {
			for (let propName of propertyNames) {
				obj[propName] += delta;
			}
		};
	};
	let increase = updatePropertyValues(myData)(1);
	let decrease = updatePropertyValues(myData)(-1);
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

	const updateSnake = (head, canvas) => {
		if (collision(head)(apple)) {
			increase("score", "apple");

			apple = setNewCoordinates(canvas, gridSize);
		} else {
			snake.pop();

			if (badPosition([...snake].slice(1), head, canvas)) {
				decrease("lives");
			} else if (collision(head)(chest) && canDrawChest) {
				increase("lives");

				chest = setNewCoordinates(canvas, gridSize);
			}
			apples = 0;
		}
		canDrawChest = apples > 2;
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
				return direction;
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
		updateSnake(head, canvas);
	};
	return {
		init,
		handleKeyPressed,
		draw,
		moveSnake,
		updateSnake,
		getMyData,
		myData,
	};
};
export default game;
