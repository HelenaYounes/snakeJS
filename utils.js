//check if there is collision between 2 given cells
const collision = (node) => (item) => node.x === item.x && node.y === item.y;

//check if node is within canvas area
const checkBounds = (node, dimensions) => {
	let outXaxis = node.x < 0 || node.x > dimensions.width;
	let outYaxis = node.y < 0 || node.y > dimensions.height;
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
const badPosition = (arr, node, dimensions) => {
	return checkBounds(node, dimensions) || checkCollision(arr.slice(1), node);
};

//get random x and y coordinates
const setNewCoordinates = (dimensions, cellSize) => {
	let randX =
		Math.floor(Math.random() * (dimensions.width / cellSize - 2) + 1) *
		cellSize;
	let randY =
		Math.floor(Math.random() * (dimensions.height / cellSize - 2) + 1) *
		cellSize;
	return { x: randX, y: randY };
};

const drawItems = (ctx, cellSize, ...items) => {
	items.forEach((el) => {
		if (el.active) {
			ctx.drawImage(el.img, el.x, el.y, cellSize, cellSize);
		}
	});
};

export {
	drawItems,
	collision,
	checkBounds,
	inVicinity,
	checkCollision,
	badPosition,
	setNewCoordinates,
};
