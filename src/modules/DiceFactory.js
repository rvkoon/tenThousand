import * as THREE from "three";
import CANNON from "cannon";

const CONFIG = {
  diceDefaultColor: 0xffffff,
  diceFaceSize: 1,
};

export default class DiceFactory {
  diceMaterial = new CANNON.Material("diceMaterial");

  generateDice() {
    let materials = [];

    /**
     * Loader manager
     */
    const loadingManager = new THREE.LoadingManager();
    const textureLoader = new THREE.TextureLoader(loadingManager);
    for (let i = 1; i < 7; i++) {
      materials.push(
        new THREE.MeshLambertMaterial({
          map: textureLoader.load(`/textures/diceFaces/dice_${i}.jpeg`),
        })
      );
    }

    const dice = new THREE.Mesh(
      new THREE.BoxGeometry(
        CONFIG.diceFaceSize,
        CONFIG.diceFaceSize,
        CONFIG.diceFaceSize
      ),
      materials
    );
    dice.castShadow = true;

    return dice;
  }

  generateDiceMaterial() {
    const shape = new CANNON.Box(
      new CANNON.Vec3(
        CONFIG.diceFaceSize * 0.5,
        CONFIG.diceFaceSize * 0.5,
        CONFIG.diceFaceSize * 0.5
      )
    );
    const diceBody = new CANNON.Body({
      mass: 300,
      shape: shape,
      material: this.diceMaterial,
    });
    return diceBody;
  }

  getDiceMaterial() {
    return this.diceMaterial;
  }
}
