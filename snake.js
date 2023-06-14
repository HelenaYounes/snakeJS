import game from "./game.js";
let gameInterval;
const { init, draw, moveSnake, handleKeyPressed, updateSnake } = game();
const gameLoop = () => {
	draw(), moveSnake();
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
