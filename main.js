import game from "./game.js";

const custom_options = {
	width: 800,
	height: 600,
	speed: 150,
};
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let startPauseDiv = document.getElementById("startPause");
let scoreSpan = document.getElementById("score");

let countdownWrapper = document.getElementById("countdown_wrapper");
countdownWrapper.style.display = "none";
let countdownSpan = document.getElementById("countdown");

let gameoverDiv = document.getElementById("game-over");
let canvasDiv = document.getElementById("gameCanvas");
let scoreDiv = document.getElementById("score");
let levelDiv = document.getElementById("level");
let livesDiv = document.getElementById("lives");
let highestScoreDiv = document.getElementById("highestscore");
let newGame = true;
let updateInterval;

const myGame = game(custom_options, canvas, ctx);
let { init, getMyData, stopGame, runGame, getBonus } = myGame;
const reset = () => {
	let { highestscore, score, level, lives } = getMyData();
	gameoverDiv.style.opacity = "0";
	startPauseDiv.textContent = "NEW GAME";
	newGame = true;
	highestScoreDiv.textContent = highestscore;
	startPauseDiv.textContent = "NEW GAME";
	scoreDiv.textContent = score;
	livesDiv.textContent = lives;
	levelDiv.textContent = level;
};
const gameover = () => {
	clearInterval(updateGame);
	gameoverDiv.style.opacity = "1";
};

const gameStateHandler = () => {
	let { gameOn } = getMyData();
	if (newGame) {
		canvasDiv.style.backgroundImage = 'url("./assets/snakeBackground.jpeg")';
		newGame = false;
	}
	gameOn ? pause() : start();
};

const updateGame = () => {
	let { score, lives, highestscore, level, gameOver } = getMyData();
	let { active, countdown } = getBonus();

	countdownWrapper.style.display = active ? "block" : "none";

	countdownSpan.textContent = countdown;
	highestScoreDiv.textContent = highestscore;
	scoreDiv.textContent = score;
	livesDiv.textContent = lives;
	levelDiv.textContent = level;
	if (gameOver) {
		gameover();
		init();
		reset();
	}
};

const start = () => {
	startPauseDiv.textContent = "PAUSE";
	runGame();
	updateInterval = setInterval(updateGame, 50);
};
const pause = () => {
	clearInterval(updateInterval);
	startPauseDiv.textContent = "RESUME";
	stopGame();
};
document.addEventListener("keydown", myGame.handleKeyPressed);
startPauseDiv.addEventListener("click", gameStateHandler);
window.addEventListener("load", init);
