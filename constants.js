//create image, and argument as the image source
const createImage = (src) => {
	const image = new Image();
	image.src = src;
	return image;
};

const snakeHead = {
	up: createImage("./assets/head_up.png"),
	down: createImage("./assets/head_down.png"),
	left: createImage("./assets/head_left.png"),
	right: createImage("./assets/head_right.png"),
};
const openHead = {
	up: createImage("./assets/openup.png"),
	down: createImage("./assets/opendown.png"),
	left: createImage("./assets/openleft.png"),
	right: createImage("./assets/openright.png"),
};

const snakeTail = {
	up: createImage("./assets/tail_up.png"),
	down: createImage("./assets/tail_down.png"),
	left: createImage("./assets/tail_left.png"),
	right: createImage("./assets/tail_right.png"),
};

const snakeBody = {
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

const appleThroat = {
	up: createImage("./assets/apple_throat_up_down.jpg"),
	down: createImage("./assets/apple_throat_up_down.jpg"),
	right: createImage("./assets/apple_throat_left_right.jpg"),
	left: createImage("./assets/apple_throat_left_right.jpg"),
};

const appleImg = createImage("./assets/apple.png");
const bonusImg = createImage("./assets/bonus.png");
const rottenImg = createImage("./assets/rotten.png");

const keyEvent = {
	ArrowDown: "down",
	ArrowUp: "up",
	ArrowLeft: "left",
	ArrowRight: "right",
};

export {
	snakeBody,
	snakeHead,
	snakeTail,
	appleThroat,
	appleImg,
	bonusImg,
	rottenImg,
	keyEvent,
	openHead,
};
