export const isInBounds = (el, canvas) => {
	let inYaxis = el.y > 0 && el.y < canvas.height;
	let inXaxis = el.x > 0 && el.x < canvas.width;
	return inXaxis && inYaxis;
};

export const moveItem = () => {
	randx = Math.floor(Math.random() * (canvas.width / squareSize)) * squareSize;
	randy = Math.floor(Math.random() * (canvas.height / squareSize)) * squareSize;
	const item = { x: randx, y: randy };
	if (!isInBounds(item)) {
		moveItem();
	}
	return { x: randx, y: randy };
};
