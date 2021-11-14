import * as THREE from "three";

const CONFIG = {
  diceDefaultColor: 0xffffff,
};

export default class Dice {
  constructor() {
    this.dice = this.createDice();
  }

  createDice() {
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

    const dice = new THREE.Mesh(new THREE.BoxGeometry(), materials);
    dice.castShadow = true;

    return dice;
  }

  getDice() {
    return this.dice;
  }

  setDicePosition({ posX = 0, posY = 0, posZ = 0 }) {
    this.dice.position.set(posX, posY, posZ);
  }
}
