const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const pauseButton = document.getElementById("startPause");
const scr = document.getElementById("score");
const msg = document.getElementById("game-over");
const life = document.getElementById("lives");
const snakeHead = new Image();
snakeHead.src = "head.jpeg";
const snakeTail = new Image();
snakeTail.src = "tail.jpg";
const snakeBody = new Image();
snakeBody.src = "body.png";
const appleImg = new Image();
appleImg.src = "apple.png";
const chestImg = new Image();
chestImg.src = "gold.jpeg";
const highestScr = document.getElementById("highestScore");
const squareSize = 20;
let distance;
let canDrawChest;
let gameInterval;
let gameoverMsg;
let snake;
let apple;
let chest;
let head;
let apples;
let direction = "left";
let gamePaused;
let score;
let lives;
let highestScore = Number(window.localStorage.getItem("highestscore")) || 0;

const moveItem = (item) => {
	item.x = Math.floor(Math.random() * (canvas.width / squareSize)) * squareSize;
	item.y =
		Math.floor(Math.random() * (canvas.height / squareSize)) * squareSize;

	let collide = snake.some((part) => part.x === item.x && part.y === item.y);
	if (collide) {
		moveItem(item);
	}
};

const draw = () => {
	ctx.drawImage(appleImg, apple.x, apple.y, squareSize, squareSize);
	snake.forEach((body) => {
		let img = body === snake[0] ? snakeHead : snakeBody;
		ctx.drawImage(img, body.x, body.y, squareSize, squareSize);
	});
	if (canDrawChest) {
		ctx.drawImage(chestImg, chest.x - squareSize, chest.y - squareSize);
	}
};

const isInBounds = (el) => {
	let inYaxis = el.y > 0 && el.y < canvas.height;
	let inXaxis = el.x > 0 && el.x < canvas.width;
	return inXaxis && inYaxis;
};

const setHigherScore = () => {
	if (score > highestScore) {
		highestScore = score;
		window.localStorage.setItem("highestscore", highestScore.toString());
	}
};

const updateScore = () => {
	apples++;
	canDrawChest = apples > 2;
	score += 10;
	moveItem(apple);
	setHigherScore();
};

const checkGameOver = () => {
	if (lives < 0) {
		gameOver();
	} else {
		switch (direction) {
			case "left":
				direction = "right";
				break;
			case "right":
				direction = "left";
				break;
			case "up":
				direction = "down";
				break;
			case "down":
				direction = "up";
				break;
		}
		pause();
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
const updateChest = () => {
	lives += 1;
	apples = 0;
	canDrawChest = false;
	moveItem(chest);
};

const caughtItem = () => {
	if (head.x === apple.x && head.y === apple.y) {
		updateScore();
	} else {
		snake.pop();
		if (head.x === chest.x && head.y === chest.y) {
			updateChest();
		} else {
			checkCollision();
		}
	}
	updateHTML();
};

const clearSetTimeout = () => {
	if (!!gameoverMsg) {
		clearTimeout(gameoverMsg);
	}
};
const clearGameInterval = () => {
	if (!!gameInterval) {
		clearInterval(gameInterval);
	}
};
const gameOver = () => {
	clearSetTimeout();
	gamePaused = true;

	clearGameInterval();
	msg.style.opacity = 1;
	toggleText(pauseButton, "New Game");
	gameoverMsg = setTimeout(init, 1000);
};

const checkCollisionBody = (el) => {
	const headInBody = snake.some((body, index) => {
		let collision = body.x === el.x && body.y === el.y;

		return collision && index !== 0;
	});
};
const checkCollision = () => {
	if (!isInBounds(head) || checkCollisionBody(head)) {
		lives -= 1;
		checkGameOver();
	}
};

const moveSnake = () => {
	const { x, y } = head;
	let newHead;
	switch (direction) {
		case "down":
			newHead = { x: x, y: y + distance };

			break;
		case "up":
			newHead = { x: x, y: y - distance };

			break;
		case "right":
			newHead = { x: x + distance, y: y };

			break;
		case "left":
			newHead = { x: x - distance, y: y };

			break;
	}
	snake.unshift(newHead);
	head = newHead;
	caughtItem();
};
const updateHTML = () => {
	life.textContent = lives.toString();
	highestScr.textContent = highestScore.toString();
	scr.textContent = score.toString();
};
const toggleText = (b, str) => {
	b.textContent = str;
};

const pause = () => {
	clearInterval(gameInterval);
	gamePaused = true;
	toggleText(pauseButton, "Resume Game");
};
const loopGame = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	draw();
	moveSnake();
};
const start = () => {
	gamePaused = false;
	toggleText(pauseButton, "Pause Game");
	gameInterval = setInterval(loopGame, speed);
};

const toggleGameOverMsg = () => {
	msg.style.opacity = 1;
};

const init = () => {
	msg.style.opacity = 0;
	chest = { x: 200, y: 300 };
	snake = [{ x: 200, y: 200 }];
	apple = { x: 250, y: 250 };
	head = { x: snake[0].x, y: snake[0].y };
	score = 0;
	speed = 150;
	lives = 0;
	apples = 0;
	distance = 20;
	canDrawChest = false;
	gamePaused = true;
	updateHTML();
	moveItem(apple);
};
pauseButton.addEventListener("click", () => {
	gamePaused ? start() : pause();
});
window.addEventListener("keydown", handleKeyPressed);
init();
