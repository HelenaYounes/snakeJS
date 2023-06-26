export const canvas = document.getElementById("gameCanvas");
export const ctx = canvas.getContext("2d");
export const scoreSpan = document.getElementById("score");
export const countdownWrapper = document.getElementById("countdown_wrapper");

export const countdownSpan = document.getElementById("countdown");
export const cellSize = 30;
export const default_params = {
	height: 500,
	direction: "left",
	width: 400,
	speed: 150,
};

//give randown x and y coordinates, withing canvas area
export const setNewCoordinates = (canvas) => {
	let randX =
		Math.floor(Math.random() * (canvas.width / cellSize - 2) + 1) * cellSize;
	let randY =
		Math.floor(Math.random() * (canvas.height / cellSize - 2) + 1) * cellSize;
	return { x: randX, y: randY };
};

export const center = (val) => Math.floor(val / (2 * cellSize)) * cellSize;

//create image, and argument as the image source
export const createImage = (src) => {
	const image = new Image();
	image.src = src;
	return image;
};

export const snakeHead = {
	up: createImage("./assets/head_up.png"),
	down: createImage("./assets/head_down.png"),
	left: createImage("./assets/head_left.png"),
	right: createImage("./assets/head_right.png"),
};
export const openHead = {
	up: createImage("./assets/openup.png"),
	down: createImage("./assets/opendown.png"),
	left: createImage("./assets/openleft.png"),
	right: createImage("./assets/openright.png"),
};

export const snakeTail = {
	up: createImage("./assets/tail_up.png"),
	down: createImage("./assets/tail_down.png"),
	left: createImage("./assets/tail_left.png"),
	right: createImage("./assets/tail_right.png"),
};

export const snakeBody = {
	up: createImage("./assets/body_vertical.png"),
	down: createImage("./assets/body_vertical.png"),
	right: createImage("./assets/body_horizontal.png"),
	left: createImage("./assets/body_horizontal.png"),
	rightdown: createImage("./assets/body_curve_bottomleft.png"),
	upleft: createImage("./assets/body_curve_bottomleft.png"),
	rightup: createImage("./assets/body_curve_topleft.png"),
	downleft: createImage("./assets/body_curve_topleft.png"),
	downright: createImage("./assets/body_curve_topright.png"),
	leftup: createImage("./assets/body_curve_topright.png"),
	upright: createImage("./assets/body_curve_bottomright.png"),
	leftdown: createImage("./assets/body_curve_bottomright.png"),
};

export const appleThroat = {
	up: createImage("./assets/apple_throat_up_down.jpg"),
	down: createImage("./assets/apple_throat_up_down.jpg"),
	right: createImage("./assets/apple_throat_left_right.jpg"),
	left: createImage("./assets/apple_throat_left_right.jpg"),
};

export const images = {
	apple: createImage("./assets/apple.png"),
	bonus: createImage("./assets/bonus.png"),
	rotten: createImage("./assets/rotten.png"),
};
export const foods = {
	apple: { ...setNewCoordinates(canvas), img: images.apple, active: true },
	bonus: { ...setNewCoordinates(canvas), img: images.bonus, active: false },
	rotten: { ...setNewCoordinates(canvas), img: images.rotten, active: false },
};
export const keyEvent = {
	ArrowDown: "down",
	ArrowUp: "up",
	ArrowLeft: "left",
	ArrowRight: "right",
};
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

export const toggle = (item) => {
	return !item;
};

export const stopIntervals = (...args) => {
	args.forEach((el) => clearInterval(el));
};
// export let timeout;

export const animations = (obj, timeout) => {
	const appleElement = document.createElement("div");
	appleElement.classList.add("jump-animation");
	appleElement.innerText = "+5";
	document.body.appendChild(appleElement);

	// Calculate the position of the score span
	const scoreRect = scoreSpan.getBoundingClientRect();
	const scoreX = scoreRect.left + scoreRect.width / 2;
	const scoreY = scoreRect.top + scoreRect.height / 2;

	// Calculate the position of the canvas
	const canvasRect = canvas.getBoundingClientRect();
	const canvasX = canvasRect.left + obj.x;
	const canvasY = canvasRect.top + obj.y;

	// Animate the apple jump from the canvas to the score span
	appleElement.style.left = canvasX + "px";
	appleElement.style.top = canvasY + "px";
	appleElement.style.transition = "all 1s";

	// Remove the apple element after the animation finishes
	requestAnimationFrame(() => {
		appleElement.style.left = scoreX + "px";
		appleElement.style.top = scoreY + "px";
		appleElement.style.opacity = "0";
	});
	timeout = setTimeout(() => {
		appleElement.remove();
	}, 2000);
};
// export const requestAnimationFrame = () => {
// 	appleElement.style.left = scoreX + "px";
// 	appleElement.style.top = scoreY + "px";
// 	appleElement.style.opacity = "0";
// };
