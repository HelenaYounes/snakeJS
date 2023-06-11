import game from "./game.js";
const { init, draw, moveSnake, checkPosition, handleKeyPressed } = game();
let gameInterval;
const gameLoop = () => {
	draw(), moveSnake(), checkPosition();
};
const startPause = document.getElementById("startPause");

document.addEventListener("keydown", handleKeyPressed);
startPause.addEventListener("click", () => {
	gameInterval = setInterval(gameLoop, 200);
});

// 	gamePaused =!gamePaused
// // 	startPause.textContent = startButtonText;

// // 	}

// // const msg = document.getElementById("game-over");

// // gameOver.init
// // const updateHTML = () => {
// // 	life.textContent = lives.toString();
// // 	highestScr.textContent = highestScore.toString();
// // 	scr.textContent = score.toString();
// // };
// // const updateHighestScore = () => {
// // 	if (score > highestScore) {
// // 		highestScore = score;
// // 		highestScr.textContent = `${highestScore}`;
// // 		localStorage.setItem("highestScore", `${highestScore}`);
// // 	}
// // };
// // const clearSetTimeout = () => {
// // 	if (!!gameoverMsg) {
// // 		clearTimeout(gameoverMsg);
// // 	}
// // };
// // const clearGameInterval = () => {
// // 	if (!!gameInterval) {
// // 		clearInterval(gameInterval);
// // 	}
// // };
// // const gameOver = () => {
// // 	clearTimeout();
// // 	gamePaused = true;
// // }
// // 	clearGameInterval();
// // 	msg.style.opacity = 1;
// // 	toggleText(startPause, "New Game");
// // 	gameoverMsg = setTimeout(init, 1000);
// // };

// // const toggleGameOverMsg = () => {
// // 	msg.style.opacity = 1;
// // };

// // const init = () => {
// // 	msg.style.opacity = 0;
// // 	apple = { x: initialapple.x, y: initialapple.y };
// // 	chest = { x: initialchest.x, y: initialchest.y };
// // 	snake = [{ x: initialsnake[0].x, y: initialsnake[0].y }];
// // 	score = 0;
// // 	speed = 200;
// // 	lives = 0;
// // 	apples = 0;
// // 	canDrawChest = false;
// // 	gamePaused = true;
// // 	// updateHTML();
// // };

// // 	const increaseSpeed = () => {
// // 		clearGameInterval(gameInterval);
// // 		speed = speed > 50 ? speed - 10 : 50;
// // 		gameInterval = setInterval(loopGame, speed);
// // 	};
// // 	const pause = () => {
// // 		clearInterval(gameInterval);
// // 		gamePaused = true;
// // 		toggleText(startPause);
// // 	};

// // 	const toggleText = (el, str) => {
// // 		let text = gamePaused? "Resume Game" : "Pause Game";
// // 		el.textContent = text;
// // 	};
// // startPause.addEventListener("click", () => {
// // 	gamePaused =!gamePaused
// // 	startPause.textContent = startButtonText;

// // 	}
// // 	});
// const play = game();
// const loop = () => {
// 	play.draw();
// 	play.moveSnake();
// };

// play.init();
// setInterval(loop, 200);
