//check if there is collision between 2 given cells
export const collision = (node) => (item) =>
	node.x === item.x && node.y === item.y;

//check if node is within canvas area
export const checkBounds = (node, canvas) => {
	let outXaxis = node.x < 0 || node.x > canvas.width;
	let outYaxis = node.y < 0 || node.y > canvas.height;
	return outXaxis || outYaxis;
};

//check if a cell/square is within a given distance of another cell/square
export const inVicinity = (node, item, cellSize) => {
	let withinXaxis =
		node.x <= item.x + 2 * cellSize && node.x >= item.x - 2 * cellSize;
	let withinYaxis =
		node.y <= item.y + 2 * cellSize && node.y >= item.y - 2 * cellSize;
	return withinXaxis && withinYaxis;
};

//check if any segment of given array is colliding with specific square/cell
export const checkCollision = (arr, node) => {
	return arr.some(collision(node));
};

//check both if given cell is within canvas area or if it collides with a specific cell/
export const badPosition = (arr, node, canvas) => {
	return checkBounds(node, canvas) || checkCollision(arr, node);
};

//give randown x and y coordinates, withing canvas area
export const setNewCoordinates = (canvas, cellSize) => {
	let randX =
		Math.floor(Math.random() * (canvas.width / cellSize - 1)) * cellSize;
	let randY =
		Math.floor(Math.random() * (canvas.height / cellSize - 1)) * cellSize;
	return { x: randX, y: randY };
};

//create image, and argument as the image source
export const createImage = (src) => {
	const image = new Image();
	image.src = src;
	return image;
};
