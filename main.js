import game from "./game.js";

const custom_options = {
	width: 600,
	height: 600,
	speed: 150,
};

const startPause = document.getElementById("startPause");
const gameoverDiv = document.getElementById("game-over");
const highestscoreDiv = document.getElementById("highestscore");
const livesDiv = document.getElementById("lives");

const opacity = window
	.getComputedStyle(gameoverDiv)
	.getPropertyValue("opacity");

let gameInterval, newGame;

const myGame = game(custom_options);

let { init, handleKeyPressed, draw, moveSnake, getMyData, myData } = myGame;
// console.log({ init });
const updateDivs =
	(obj) =>
	(...ids) => {
		let div;
		let value;
		for (let id of ids) {
			div = document.getElementById(id);
			value = getMyData(id);
			div.textContent = `${value}`;
		}
	};
let updateDivsValue = updateDivs(myData);

const restart = () => {
	gameInterval = clearInterval(gameInterval);

	opacity = 1;
	startPause.textContent = "New Game";
	gameInterval = setTimeout(setGame, 1000);

	// init()
};
const updateGame = () => {
	updateDivsValue("score", "lives");
	let score = getMyData("score");
	let highestscore = localStorage.getItem("highestscore") || 0;
	if (score > highestscore) {
		highestscore = score;
		highestscoreDiv.textContent = `${highestcore}`;
		localStorage.clear();
		localStorage.setItem("highestscore", highestscore);
	}
	if (getMyData("lives") < 0) {
		restart();
	}
};

const loop = () => {
	// let head =
	draw(), moveSnake(), updateGame();
};

const resume = () => {
	startPause.textContent = "pause";
	gameInterval = setInterval(loop, custom_options.speed);
};
const pause = () => {
	gameInterval = clearInterval(gameInterval);
	startPause.textContent = "resume";
};

const setGame = () => {
	gameInterval = clearTimeout(gameInterval);
	newGame = true;
	init();
};
const gameStart = () => {
	if (newGame) {
		newGame = false;
		gameInterval = setInterval(loop, custom_options.speed);
	} else {
		gameInterval ? pause() : resume();
	}
};

document.addEventListener("keydown", handleKeyPressed);
startPause.addEventListener("click", gameStart);
window.addEventListener("load", setGame);
