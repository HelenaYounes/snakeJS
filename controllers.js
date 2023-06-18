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

export const setNewCoordinates = (canvas, gridSize) => {
	let randX = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
	let randY = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
	return { x: randX, y: randY };
};

export const updatePropertyValues =
	(delta) =>
	(obj, ...propertyNames) => {
		for (let propName of propertyNames) {
			obj[propName] += delta;
		}
	};

export const increase = updatePropertyValues(1);
export const decrease = updatePropertyValues(-1);
export const reset =
	(obj) =>
	(...propertyNames) => {
		for (let propName of propertyNames) {
			obj[propName] = 0;
		}
	};
