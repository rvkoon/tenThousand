import {
  Mesh,
  BoxGeometry,
  MeshStandardMaterial,
  LoadingManager,
  TextureLoader,
} from "three";

function generateDiceMaterial() {
  let materials = [];

  /**
   * Loader manager
   */
  const loadingManager = new LoadingManager();
  const textureLoader = new TextureLoader(loadingManager);
  for (let i = 1; i < 7; i++) {
    materials.push(
      new MeshStandardMaterial({
        map: textureLoader.load(`/textures/diceFaces/dice_${i}.jpeg`),
        flatShading: true,
        roughness: 0.5,
        metalness: 0.75,
      })
    );
  }

  return materials;
}

export function generateDice(dSize) {
  const dice = new Mesh(
    new BoxGeometry(dSize, dSize, dSize),
    generateDiceMaterial()
  );
  dice.castShadow = true;
  return dice;
}

export function generateDices(num) {
  const DICES = [];
  for (let i = 1; i < num + 1; i++) {
    DICES.push(generateDice(1));
  }
  return DICES;
}
