import game from "./game.js";
const custom_options = {
	width: 600,
	height: 600,
	speed: 150,
};

let startPause = document.getElementById("startPause");
let gameoverDiv = document.getElementById("game-over");
let highestScoreDiv = document.getElementById("highestscore");
let opacity = window.getComputedStyle(gameoverDiv).getPropertyValue("opacity");
let gameInterval, gameTimeout;
let highestscore = JSON.parse(localStorage.getItem("highestscore")) || 0;
highestScoreDiv.textContent = `${highestscore}`;
let gameState = "PAUSE";
const myGame = game(custom_options);
let {
	init,
	handleKeyPressed,
	draw,
	moveSnake,
	getMyData,
	updateHighScore,
	myData,
} = myGame;
init();
const reset = () => {
	clearTimeout(gameTimeout);
	startPause.textContent = "New Game";
	opacity = "0";
	gameState = "NEW";
	init();
};
const stop = () => {
	clearInterval(gameInterval);
	opacity = "1";
	gameTimeout = setTimeout(reset, 1500);
};

const checkGameOver = () => {
	if (getMyData("lives") < 0) {
		gameState = "GAMEOVER";
		gameStateHandler();
	}
};

const gameStateHandler = () => {
	switch (gameState) {
		case "NEW":
			reset();
			break;
		case "PAUSE":
			start();
			break;
		case "RUNNING":
			pause();
			break;
		case "GAMEOVER":
			stop();
			break;
	}
};

const loop = () => {
	draw();
	moveSnake();
	highestscore = updateHighScore(highestScoreDiv, highestscore);
};

const start = () => {
	gameState = "RUNNING";
	gameInterval = setInterval(loop, custom_options.speed);
};
const pause = () => {
	clearInterval(gameInterval);
	gameState = "PAUSE";
};

document.addEventListener("keydown", handleKeyPressed);
startPause.addEventListener("click", gameStateHandler);
// window.addEventListener("load", init);
