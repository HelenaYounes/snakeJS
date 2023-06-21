export const collision = (node) => (item) =>
	node.x === item.x && node.y === item.y;

export const checkBounds = (node, canvas) => {
	let outXaxis = node.x < 0 || node.x > canvas.width;
	let outYaxis = node.y < 0 || node.y > canvas.height;
	return outXaxis || outYaxis;
};
export const checkCollision = (arr, node) => {
	return arr.some(collision(node));
};
export const badPosition = (arr, node, canvas) => {
	return checkBounds(node, canvas) || checkCollision(arr, node);
};

export const setNewCoordinates = (canvas, cellSize) => {
	let randX =
		Math.floor(Math.random() * (canvas.width / cellSize - 1) + 1) * cellSize;
	let randY =
		Math.floor(Math.random() * (canvas.height / cellSize - 1) + 1) * cellSize;
	return { x: randX, y: randY };
};
