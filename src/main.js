import GAME_CONFIG from "./gameConfig";
import { initiateGameScene, render } from "./modules/Game";
import { Camera, CAMERA_CONSTANTS } from "./modules/Camera";
import { Light, LIGHT_CONSTANTS } from "./modules/Light";
import { setRenderer } from "./modules/Renderer";
import { generateDices } from "./modules/Dice";

function initGameObjects() {
  const gameScene = initiateGameScene();

  const gameCamera = Camera.generateCamera(
    CAMERA_CONSTANTS.TYPES.PERSPECTIVE_CAMERA
  )(50, GAME_CONFIG.WINDOW.WIDTH / GAME_CONFIG.WINDOW.HEIGHT, 0.1, 1000);
  gameCamera.position.z = 10;

  const gameRenderer = setRenderer(GAME_CONFIG.CANVAS);
  gameRenderer.setSize(GAME_CONFIG.WINDOW.WIDTH, GAME_CONFIG.WINDOW.HEIGHT);

  const gameAmbientLight = Light.generateLight(LIGHT_CONSTANTS.TYPES.AMBIENT)({
    color: 0xffffff,
    intensity: 4,
  });
  gameScene.add(gameAmbientLight);

  const DICES = generateDices(1);
  DICES.forEach((dice) => gameScene.add(dice));

  return {
    gameScene,
    gameCamera,
    gameRenderer,
    gameAmbientLight,
    DICES,
  };
}

function main() {
  const { gameScene, gameCamera, gameRenderer, gameAmbientLight, DICES } =
    initGameObjects();
  render({ renderer: gameRenderer, scene: gameScene, camera: gameCamera });
}

export default main;
