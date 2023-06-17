export let apple;
export let snake;
export let chest;
export let speed;
export let canDrawChest;
export let apples;
export let direction;
export let score;
export let highestscore;
export let lives;
export let gameInterval;
export let gamePaused;
export const getDoc = (id) => {
	return document.getElementById(id);
};

export const updateDoc = (id, value) => {
	let doc = getDoc(id);
	doc.textContent = `${value}`;
};
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

export const checkBounds = (head, canvas) => {
	let outXaxis = head.x < 0 || head.x > canvas.width;
	let outYaxis = head.y < 0 || head.y > canvas.height;
	return outXaxis || outYaxis;
};
export const collision = (head, item) => head.x === item.x && head.y === item.y;

export const checkCollision = (arr, head) => {
	return arr.some((el) => collision(head, el));
};

export const gameOver = () => {
	let div = getDoc("game-over");
	div.style.opacity = 1;
};

export const setNewCoordinates = (canvas, gridSize) => {
	let randX = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
	let randY = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
	return { x: randX, y: randY };
};
