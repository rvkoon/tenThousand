import { Clock } from "three";

const GAME_CONFIG = {};

GAME_CONFIG.CANVAS = document.querySelector("canvas.webgl");
GAME_CONFIG.WINDOW = {
  WIDTH: window.innerWidth,
  HEIGHT: window.innerHeight,
};
GAME_CONFIG.CLOCK = new Clock();
GAME_CONFIG.OLD_ELAPSED_TIME = 0;

export default GAME_CONFIG;
