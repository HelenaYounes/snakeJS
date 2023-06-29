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
let updateInterval, appleTimeout;
let animation = true;
let highScr = JSON.parse(localStorage.getItem("highestscore")) || 0;

const myGame = game(custom_options, canvas, ctx);
let { init, getMyData, stopGame, runGame, getBonus } = myGame;

const appleAnimation = (apple) => {
	if (animation) {
		animation = false;
		clearTimeout(appleTimeout);
		//add apple animation

		// Animate the apple jump
		const appleElement = document.createElement("div");
		appleElement.classList.add("jump-animation");
		appleElement.innerText = "+5";
		document.body.appendChild(appleElement);

		// Calculate the position of the score span
		const scoreRect = scoreSpan.getBoundingClientRect();
		const scoreX = scoreRect.left + scoreRect.width / 2;
		const scoreY = scoreRect.top + scoreRect.height / 2;

		// Calculate the position of the canvas
		const canvasRect = canvas.getBoundingClientRect();
		const canvasX = canvasRect.left + apple.x;
		const canvasY = canvasRect.top + apple.y;

		// Animate the apple jump from the canvas to the score span
		appleElement.style.left = canvasX + "px";
		appleElement.style.top = canvasY + "px";
		appleElement.style.transition = "all 1s";

		requestAnimationFrame(() => {
			appleElement.style.left = scoreX + "px";
			appleElement.style.top = scoreY + "px";
			appleElement.style.opacity = "0";
		});

		// Remove the apple element after the animation finishes
		appleTimeout = setTimeout(() => {
			appleElement.remove();
			animation = true;
		}, 2000);
	}
};
const gameover = () => {
	clearInterval(updateGame);
	gameoverDiv.style.opacity = "1";
	init();
};

const gameStateHandler = () => {
	let { gameOn } = getMyData();
	if (newGame) {
		defaultGame();
		canvasDiv.style.backgroundImage = 'url("./assets/snakeBackground.jpeg")';
		newGame = false;
	}
	gameOn ? pause() : start();
};

const updateGame = () => {
	let { score, lives, level, gameOver, eatenApple } = getMyData();
	let { active, countdown } = getBonus();
	if (!!eatenApple) {
		appleAnimation(eatenApple);
	}
	countdownWrapper.style.display = active ? "block" : "none";
	if (score > highScr) {
		highScr = score;
		localStorage.clear();
		localStorage.setItem("highestscore", JSON.stringify(highScr));
	}
	countdownSpan.textContent = countdown;

	highestScoreDiv.textContent = highScr;
	scoreDiv.textContent = score;
	livesDiv.textContent = lives;
	levelDiv.textContent = level;
	if (gameOver) {
		gameover();
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

const defaultGame = () => {
	init();
	let { score, level, lives } = getMyData();
	gameoverDiv.style.opacity = "0";
	startPauseDiv.textContent = "NEW GAME";
	newGame = true;
	highestScoreDiv.textContent = highScr;
	scoreDiv.textContent = score;
	livesDiv.textContent = lives;
	levelDiv.textContent = level;
};
document.addEventListener("keydown", myGame.handleKeyPressed);
startPauseDiv.addEventListener("click", gameStateHandler);
window.addEventListener("load", defaultGame);
