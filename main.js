import game from "./game.js";

const custom_options = {
	width: 800,
	height: 600,
	speed: 150,
};

// COLLECT DIVS
const canvas = document.getElementById("gameCanvas");
const startPauseDiv = document.getElementById("startPause");
const scoreSpan = document.getElementById("score");
const countdownWrapper = document.getElementById("countdown_wrapper");
const countdownSpan = document.getElementById("countdown");
const gameoverDiv = document.getElementById("game-over");
const canvasDiv = document.getElementById("gameCanvas");
const scoreDiv = document.getElementById("score");
const levelDiv = document.getElementById("level");
const livesDiv = document.getElementById("lives");
const highestScoreDiv = document.getElementById("highestscore");

const elements = {
	canvas,
	startPauseDiv,
	scoreSpan,
	countdownWrapper,
	countdownSpan,
	gameoverDiv,
	canvasDiv,
	scoreDiv,
	levelDiv,
	livesDiv,
	highestScoreDiv,
};

// INIT DISPLAY

const myGame = game(custom_options, elements);
let { init } = myGame;

window.addEventListener("load", init);
