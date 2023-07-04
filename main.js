import game from "./game.js";

const custom_options = {
	width: 800,
	height: 600,
	speed: 150,
};

// COLLECT DIVS
const canvas = document.getElementById("gameCanvas");
const startButton = document.getElementById("startPause");
const scoreSpan = document.getElementById("score");
const countdownWrapper = document.getElementById("countdown_wrapper");
const countdownSpan = document.getElementById("countdown");
const gameoverSpan = document.getElementById("game-over");
const levelSpan = document.getElementById("level");
const livesSpan = document.getElementById("lives");
const highestScoreSpan = document.getElementById("highestscore");

const elements = {
	canvas,
	startButton,
	countdownWrapper,
	countdownSpan,
	gameoverSpan,
	scoreSpan,
	levelSpan,
	livesSpan,
	highestScoreSpan,
};

// INIT DISPLAY

const myGame = game(custom_options, elements);
let { initGame } = myGame;

window.addEventListener("load", initGame);
