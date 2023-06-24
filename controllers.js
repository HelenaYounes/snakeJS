// add visual effect when hit wall or bad apple
//add effect when earn bonus life, maybe a little eart on Lives div, tat turn into digit

//have apple jump when caught from canvas to score Div

//add menu dropdown, can change backgroud image, snake color,

//bonus apple disapears after timeout with div showing remaining time

// make curried function that makes a given property of a given object set to true/false

//partially applied function, like caught Apple/bonus
// or activate rotten/bonus like :
// activateItaem = fn => (...args) => {
// return fn(...args)
// }

// const activate =
// 	(fn) =>
// 	(...args) => {
// 		fn(...args);
// 	};

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
export const inVicinity = (node, cellSize, item) => {
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
		Math.floor(Math.random() * (canvas.width / cellSize - 2) + 1) * cellSize;
	let randY =
		Math.floor(Math.random() * (canvas.height / cellSize - 2) + 1) * cellSize;
	return { x: randX, y: randY };
};

//create image, and argument as the image source
export const createImage = (src) => {
	const image = new Image();
	image.src = src;
	return image;
};
