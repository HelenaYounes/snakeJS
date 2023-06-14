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

export const collision = (head) => (item) => {
	return head.x === item.x && head.y === item.y;
};
export const checkBounds = (head) => {
	let outXaxis = head.x < 0 || head.x > canvas.width;
	let outYaxis = head.y < 0 || head.y > canvas.height;
	return outXaxis || outYaxis;
};
export const checkCollision = (arr, head) => {
	return arr.some((el) => collision(head)(el));
};
export const badPosition = (head, snake) => {
	return checkBounds(head) || checkCollision([...snake.slice(1)], head);
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
