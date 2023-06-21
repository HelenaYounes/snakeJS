import game from "./game.js";

const custom_options = {
	width: 800,
	height: 600,
	speed: 150,
};

let startPauseDiv = document.getElementById("startPause");

let gameoverDiv = document.getElementById("game-over");
let scoreDiv = document.getElementById("score");
let levelDiv = document.getElementById("level");
let livesDiv = document.getElementById("lives");
let highestScoreDiv = document.getElementById("highestscore");
let gameInterval, gameTimeout;
let highestscore = JSON.parse(localStorage.getItem("highestscore")) || 0;
highestScoreDiv.textContent = `${highestscore}`;
let isGameRunning = false;
const myGame = game(custom_options);
let { init, draw, moveSnake, getLives, getScore, getLevel, getSpeed } = myGame;
let gameSpeed = custom_options.speed;
const reset = () => {
	clearTimeout(gameTimeout);
	gameoverDiv.style.opacity = "0";
	isGameRunning = false;
	startPauseDiv.textContent = "NEW GAME";
	gameSpeed = custom_options.speed;
	scoreDiv.textContent = 0;
	livesDiv.textContent = 0;
	levelDiv.textContent = 1;
	init();
};
const gameOver = () => {
	clearInterval(gameInterval);
	gameoverDiv.style.opacity = "1";
	gameTimeout = setTimeout(reset, 1500);
};

const gameStateHandler = () => {
	isGameRunning ? pause() : start();
};
const updateHighScore = () => {
	highestScoreDiv.textContent = `${highestscore}`;
	localStorage.clear();
	localStorage.setItem("highestscore", JSON.stringify(highestscore));
};

const updateGame = (score, lives, level, speed) => {
	scoreDiv.textContent = `${score}`;
	livesDiv.textContent = `${lives}`;
	levelDiv.textContent = `${level}`;
	if (score > highestscore) {
		highestscore = score;
		updateHighScore();
	}
	if (gameSpeed > speed) {
		gameSpeed = speed;
		clearInterval(gameInterval);
		gameInterval = setInterval(loop, gameSpeed);
	}
	if (lives < 0) {
		gameOver();
	}
};
const loop = () => {
	draw();
	moveSnake();
	let score = getScore();
	let lives = getLives();
	let level = getLevel();
	let speed = getSpeed();
	updateGame(score, lives, level, speed);
};

const start = () => {
	startPauseDiv.textContent = "PAUSE";
	isGameRunning = true;
	gameInterval = setInterval(loop, gameSpeed);
};
const pause = () => {
	clearInterval(gameInterval);
	startPauseDiv.textContent = "RESUME";
	isGameRunning = false;
};
document.addEventListener("keydown", myGame.handleKeyPressed);
startPauseDiv.addEventListener("click", gameStateHandler);
window.addEventListener("load", init);
