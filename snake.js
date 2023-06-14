import { highestscore, lives, score, speed } from "./game.js";
import game from "./game.js";
const { init, draw, moveSnake, handleKeyPressed, updateSnake } = game();
const gameLoop = () => {
	draw(), moveSnake(), updateSnake();
};
const startPause = document.getElementById("startPause");
// const start = () => {
// 	gameInterval = setInterval(gameLoop, speed);
// };
document.addEventListener("keydown", handleKeyPressed);
startPause.addEventListener("click", () => {
	gameInterval = setInterval(gameLoop, 200);
});
const newGame = () => {
	init();
};
