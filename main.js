import game from "./game.js";

const custom_options = {
	width: 800,
	height: 600,
	speed: 150,
};
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let startPauseDiv = document.getElementById("startPause");

let gameoverDiv = document.getElementById("game-over");
let canvasDiv = document.getElementById("gameCanvas");
let scoreDiv = document.getElementById("score");
let levelDiv = document.getElementById("level");
let livesDiv = document.getElementById("lives");
let highestScoreDiv = document.getElementById("highestscore");

let newGame = true;

let isGameRunning = false;
let updateInterval;
const myGame = game(custom_options, canvas, ctx);
let { init, getMyData, stopGame, runGame, loop } = myGame;
const reset = () => {
	// clearTimeout(gameTimeout);
	gameoverDiv.style.opacity = "0";
	isGameRunning = false;
	startPauseDiv.textContent = "NEW GAME";
	newGame = true;
	highestScoreDiv.textContent = getHighScore();

	scoreDiv.textContent = 0;
	livesDiv.textContent = 0;
	levelDiv.textContent = 1;
};
const gameOver = () => {
	gameoverDiv.style.opacity = "1";
	// canvasDiv.style.backgroundImage = "url(./assets/gameover.png)";
	// gameTimeout = setTimeout(reset, 1000);
};

const gameStateHandler = () => {
	let { gameOn } = getMyData();
	if (newGame) {
		canvasDiv.style.backgroundImage = 'url("./assets/snakeBackground.jpeg")';
		newGame = false;
		// gameTimeout = setInterval(start, 1000);
	}
	gameOn ? pause() : start();
};
const updateHighScore = () => {
	highestScoreDiv.textContent = highestscore;
	localStorage.clear();
	localStorage.setItem("highestscore", JSON.stringify(highestscore));
};

const updateGame = () => {
	let { score, lives, highestscore, level, respawned } = getMyData();
	if (score > highestscore) {
		highestscore = score;
		updateHighScore();
	}

	scoreDiv.textContent = score;
	livesDiv.textContent = lives;
	levelDiv.textContent = level;
	if (respawned) {
		pause();
	}
};

const start = () => {
	startPauseDiv.textContent = "PAUSE";
	runGame();
	updateInterval = setInterval(updateGame, 150);
};
const pause = () => {
	clearInterval(updateInterval);
	startPauseDiv.textContent = "RESUME";
	stopGame();
};
document.addEventListener("keydown", myGame.handleKeyPressed);
startPauseDiv.addEventListener("click", gameStateHandler);
window.addEventListener("load", init);
