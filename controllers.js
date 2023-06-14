export const canvas = document.getElementById("gameCanvas");
export const ctx = canvas.getContext("2d");
export const gridSize = 20;

export const initial_values = {
	speed: 200,
	canDrawChest: false,
	direction: "left",
	score: 0,
	lives: 0,
	apples: 0,
	highestscore: Number(localStorage.getItem("highestscore")) || 0,
};
export let {
	speed,
	score,
	canDrawChest,
	direction,
	lives,
	apples,
	highestscore,
} = initial_values;

export const getDoc = (id) => {
	return document.getElementById(id);
};

export const updateDoc = (id, value) => {
	let doc = getDoc(id);
	doc.textContent = `${value}`;
};
export const update = (key, newVal) => {
	game_values[key] = newVal;
};

export const badPosition = (head, snake) => {
	return checkBounds(head) || checkCollision([...snake.slice(1)], head);
};

// export const checkGameOver = (lives) => {};

// export const changeDirection = () => {
// 	switch (direction) {
// 		case "left":
// 			direction = "right";
// 			break;
// 		case "right":
// 			direction = "left";
// 			break;
// 		case "up":
// 			direction = "down";
// 			break;
// 		case "down":
// 			direction = "up";
// 			break;
// 	}
// };

export const checkBounds = (head) => {
	let outXaxis = head.x < 0 || head.x > canvas.width;
	let outYaxis = head.y < 0 || head.y > canvas.height;
	return outXaxis || outYaxis;
};
export const collision = (head) => (item) => {
	return head.x === item.x && head.y === item.y;
};
export const collisionSnake = collision(head);

export const checkCollision = (arr, head) => {
	return arr.some((el) => collision(head)(el));
};

export const gameOver = () => {
	let div = getDoc("game-over");
	div.style.opacity = 1;
};

export const setNewCoordinates = () => {
	let randX = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
	let randY = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
	return { x: randX, y: randY };
};
