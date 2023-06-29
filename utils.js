//check if there is collision between 2 given cells
const collision = (node) => (item) => node.x === item.x && node.y === item.y;

//check if node is within canvas area
const checkBounds = (node, canvas) => {
	let outXaxis = node.x < 0 || node.x > canvas.width;
	let outYaxis = node.y < 0 || node.y > canvas.height;
	return outXaxis || outYaxis;
};

//check if a cell/square is within a given distance of another cell/square
const inVicinity = (node, item, cellSize) => {
	let withinXaxis =
		node.x <= item.x + 2 * cellSize && node.x >= item.x - 2 * cellSize;
	let withinYaxis =
		node.y <= item.y + 2 * cellSize && node.y >= item.y - 2 * cellSize;
	return withinXaxis && withinYaxis;
};

//check if any segment of given array is colliding with specific square/cell
const checkCollision = (arr, node) => {
	return arr.some(collision(node));
};

//check both if given cell is within canvas area or if it collides with a specific cell/
const badPosition = (arr, node, canvas) => {
	return checkBounds(node, canvas) || checkCollision(arr.slice(1), node);
};

export { collision, checkBounds, inVicinity, checkCollision, badPosition };
