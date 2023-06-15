import game from "./game.js";
const custom_options = {
	width: 600,
	height: 600,
	speed: 150,
};

let startPause = document.getElementById("startPause");
let gameoverDiv = document.getElementById("game-over");
let opacity = window.getComputedStyle(gameoverDiv).getPropertyValue("opacity");

let gameInterval, gameTimeout;
let highestscore = JSON.parse(localStorage.getItem("highestscore")) || 0;
let gameState = "NEW";
const myGame = game(custom_options);
let { init, handleKeyPressed, draw, moveSnake, getMyData, myData } = myGame;

// console.log({ init });
const updateDivs =
	(obj) =>
	(value) =>
	(...ids) => {
		for (let id of ids) {
			let div = document.getElementById(id);
			let newValue = !!value ? getMyData(id) : value;
			div.textContent = `${newValue}`;
		}
	};
let updateDivsValue = updateDivs(myData);
const restart = () => {
	opacity = 1;
	updateDivsValue("New Game")("startPause");
	gameTimeout = setTimeout(() => {
		setGame;
	}, 1000);
};
const updateHighScore = () => {
	let score = getMyData("score");

	if (score > highestscore) {
		highestscore = score;
		updateDivsValue(highestscore)("highestscore");
		localStorage.clear();
		localStorage.setItem("highestscore", JSON.stringify(highestscore));
	}
};

const checkGameOver = () => {
	if (getMyData("lives") < 0) {
		gameState = "GAMEOVER";
		clearInterval(gameInterval);
		restart();
	}
};

const gameStateHandler = () => {
	switch (gameState) {
		case "ON": {
			gameState = "PAUSE";
			pause();
			break;
		}
		case "GAMEOVER": {
			// gameState = "NEW";
			restart();
			break;
		}
		case "PAUSE": {
			gameState = "START";
			start();
			break;
		}
		case "NEW": {
			gameState = "START";
			start();
			break;
		}
	}
};
const updateGame = () => {
	updateDivsValue()("score", "lives");
	updateHighScore();
	checkGameOver();
	updateDivsValue(gameState)("startPause");
};

const loop = () => {
	// let head =
	draw(), moveSnake(), updateGame();
};
const setGame = () => {
	opacity = 0;
	gameState = "NEW";
	init();
	// clearTimeout(gameTimeout);
};

const start = () => {
	gameInterval = setInterval(loop, custom_options.speed);
};
const pause = () => {
	clearInterval(gameInterval);
};

document.addEventListener("keydown", handleKeyPressed);
startPause.addEventListener("click", gameStateHandler);
window.addEventListener("load", setGame);
