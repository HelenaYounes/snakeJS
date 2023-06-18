import game from "./game.js";
const custom_options = {
	width: 600,
	height: 600,
	speed: 150,
};

let startPause = document.getElementById("startPause");
let gameoverDiv = document.getElementById("game-over");
let highestScoreDiv = document.getElementById("highestscore");
let gameInterval, gameTimeout;
let gameData = { score: 0, lives: 0 };
let highestscore = JSON.parse(localStorage.getItem("highestscore")) || 0;
highestScoreDiv.textContent = `${highestscore}`;
let gameState = "PAUSE";
const myGame = game(custom_options);
let { init, handleKeyPressed, draw, moveSnake, getUpdatedValue } = myGame;

const reset = () => {
	clearTimeout(gameTimeout);
	startPause.textContent = "New Game";
	gameoverDiv.style.opacity = "0";
	gameState = "NEW";
	init();
};
const stop = () => {
	clearInterval(gameInterval);
	gameoverDiv.style.opacity = "1";
	gameTimeout = setTimeout(reset, 1500);
};

const gameOver = () => {
	gameState = "GAMEOVER";
	gameStateHandler();
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
const updateHighScore = (id, val) => {
	localStorage.clear();
	localStorage.setItem(id, JSON.stringify(val));
};
const updateDivVal = (id, value) => {
	let div = document.getElementById(id);
	div.textContent = `${value}`;
	if (id === "score" && value > highestscore) {
		highestscore = value;
		updateDivVal("highestscore", highestscore);
		updateHighScore("highestscore", highestscore);
	}
};

const checkUpdate = (update) => {
	let id = "lives";
	switch (update) {
		case "SCORE":
			++gameData["score"];
			id = "score";
			break;
		case "GAMEOVER":
			--gameData["lives"];
			gameOver();
			break;
		case "BONUS":
			++gameData["lives"];
			break;
		case "REDO":
			--gameData["lives"];
			break;
		default:
			return;
	}
	updateDivVal(id, gameData[id]);
};

const loop = () => {
	draw();
	moveSnake();
	checkUpdate(getUpdatedValue());
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
window.addEventListener("load", init);
