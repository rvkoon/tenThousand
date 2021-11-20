import * as THREE from "three";
import GAME_CONFIG from "../gameConfig";

export function initiateGameScene() {
  return new THREE.Scene();
}

export function render({ renderer, scene, camera }) {
  function renderTick() {
    renderer.render(scene, camera);
    requestAnimationFrame(renderTick);
  }

  renderTick();
}
